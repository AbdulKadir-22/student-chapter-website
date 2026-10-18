import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock,
  ScanLine,
} from 'lucide-react';
import { scanTicketApi } from '../api/events.api';

export default function ScannerModal({ isOpen, onClose, eventId, eventName }) {
  const queryClient = useQueryClient();

  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [scanResult, setScanResult] = useState(null); // { type: 'success'|'warning'|'error', message, member, time }
  const [sessionCount, setSessionCount] = useState(0);
  const [liveAttendeeCount, setLiveAttendeeCount] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const lastScannedTimeRef = useRef(0);
  const resultTimerRef = useRef(null);

  // Invalidate queries when closing
  const handleModalClose = () => {
    queryClient.invalidateQueries(['events']);
    queryClient.invalidateQueries(['attendees', eventId]);
    queryClient.invalidateQueries(['admin', 'dashboard']);
    onClose();
  };

  useEffect(() => {
    return () => {
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleScan = async (detectedCodes) => {
    if (!detectedCodes || detectedCodes.length === 0 || isProcessing) return;

    const rawValue = detectedCodes[0]?.rawValue?.trim();
    if (!rawValue) return;

    const now = Date.now();
    // Ignore repeated reads of the same code for 3 seconds
    if (rawValue === lastScannedCode && now - lastScannedTimeRef.current < 3000) {
      return;
    }

    lastScannedTimeRef.current = now;
    setLastScannedCode(rawValue);

    // Validate prefix
    if (!rawValue.startsWith('ACMT:')) {
      showResultCard({
        type: 'error',
        message: 'Not an ACM AMTICS ticket',
      });
      return;
    }

    const ticketCode = rawValue.replace('ACMT:', '').trim();
    if (!ticketCode) {
      showResultCard({
        type: 'error',
        message: 'Invalid ticket code payload',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await scanTicketApi(eventId, ticketCode);
      const data = res.data;

      // Update live attendee count if returned
      if (typeof data.attendeeCount === 'number') {
        setLiveAttendeeCount(data.attendeeCount);
      }

      if (data.status === 'checked_in') {
        // Vibrate on success where supported
        if (navigator.vibrate) {
          try {
            navigator.vibrate(200);
          } catch (e) {
            // Ignore vibration error
          }
        }
        setSessionCount((prev) => prev + 1);
        showResultCard({
          type: 'success',
          message: 'Checked in',
          member: data.member,
          time: data.checkedInAt,
        });
      } else if (data.status === 'already_checked_in') {
        // Amber warning
        const checkedTime = data.checkedInAt
          ? new Intl.DateTimeFormat('en-GB', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }).format(new Date(data.checkedInAt))
          : 'earlier';

        showResultCard({
          type: 'warning',
          message: `Already checked in at ${checkedTime}`,
          member: data.member,
          time: data.checkedInAt,
        });
      }

      // Invalidate relevant profile/events/attendees in the background
      queryClient.invalidateQueries(['attendees', eventId]);
      queryClient.invalidateQueries(['events']);
    } catch (err) {
      const resp = err.response?.data;
      const errMsg = resp?.message || 'Check-in failed';
      showResultCard({
        type: 'error',
        message: errMsg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const showResultCard = (result) => {
    setScanResult(result);
    if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    // Keep visible for ~2 seconds, then resume scanning without closing camera
    resultTimerRef.current = setTimeout(() => {
      setScanResult(null);
    }, 2200);
  };

  const handleError = (error) => {
    console.error('QR Scanner Error:', error);
    if (error?.name === 'NotAllowedError' || error?.message?.includes('Permission')) {
      setCameraError(
        'Camera permission was denied. Please allow camera access in your browser settings to scan QR tickets.'
      );
    } else if (error?.name === 'NotFoundError') {
      setCameraError('No camera found on this device.');
    } else {
      setCameraError('Unable to access camera. Please make sure you are using HTTPS or localhost.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-slate-900 sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-800">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between z-10 bg-slate-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-[#a855f7] flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Scan Tickets
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                {eventName || 'Event Check-in'}
              </p>
            </div>
          </div>

          <button
            onClick={handleModalClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Counters Banner */}
        <div className="px-5 py-2.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Checked in this session: <span className="text-white font-bold">{sessionCount}</span></span>
          </div>
          {liveAttendeeCount !== null && (
            <div className="text-slate-400">
              Total attendees: <span className="text-white font-bold">{liveAttendeeCount}</span>
            </div>
          )}
        </div>

        {/* Camera Viewport Area */}
        <div className="relative flex-1 sm:h-[380px] bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-8 text-center text-slate-400 max-w-sm flex flex-col items-center">
              <Camera className="w-12 h-12 text-rose-400 mb-3" />
              <h4 className="text-sm font-bold text-white mb-1.5">
                Camera Access Error
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {cameraError}
              </p>
              <button
                onClick={() => setCameraError(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              {/* React QR Scanner */}
              <div className="w-full h-full flex items-center justify-center">
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment',
                  }}
                  styles={{
                    container: { width: '100%', height: '100%' },
                    video: { width: '100%', height: '100%', objectFit: 'cover' },
                  }}
                />
              </div>

              {/* Scanning Target Box Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                <div className="relative w-64 h-64 border-2 border-purple-400/50 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                  {/* Glowing corners */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-[#a855f7] rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-[#a855f7] rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-[#a855f7] rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-[#a855f7] rounded-br-lg" />

                  {/* Horizontal animated sweep line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#c084fc] to-transparent animate-bounce mt-32" />
                </div>
              </div>
            </>
          )}

          {/* Result Card Overlay (shown for 2s after scan) */}
          {scanResult && (
            <div className="absolute inset-x-4 bottom-4 z-20 animate-in slide-in-from-bottom-3 duration-200">
              {scanResult.type === 'success' && (
                <div className="bg-emerald-600/95 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 border border-emerald-400/40">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wide uppercase">
                        Checked In
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">
                      {scanResult.member?.name || 'Attendee'}
                    </p>
                    <p className="text-[11px] text-emerald-100 truncate">
                      {scanResult.member?.year ? `${scanResult.member.year} Year • ` : ''}
                      {scanResult.member?.department || 'Member'}
                    </p>
                  </div>
                </div>
              )}

              {scanResult.type === 'warning' && (
                <div className="bg-amber-500/95 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 border border-amber-300/40">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wide uppercase">
                        Already Checked In
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">
                      {scanResult.member?.name || 'Attendee'}
                    </p>
                    <p className="text-[11px] text-amber-100">
                      {scanResult.message}
                    </p>
                  </div>
                </div>
              )}

              {scanResult.type === 'error' && (
                <div className="bg-rose-600/95 text-white p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3.5 border border-rose-400/40">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wide uppercase">
                        Scan Error
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-rose-100 mt-0.5">
                      {scanResult.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Instructions */}
        <div className="px-5 py-3.5 bg-slate-900 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Align the member's ACM AMTICS permanent QR code inside the frame.
          </p>
        </div>
      </div>
    </div>
  );
}
