import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, AlertCircle, Sparkles } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import Button from '../../../shared/components/ui/Button';
import { getMyTicketApi } from '../api/user.api';

export default function TicketModal({ isOpen, onClose }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-ticket'],
    queryFn: getMyTicketApi,
    enabled: isOpen,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const ticket = data?.data || data;
  const qrPayload = ticket?.ticketCode ? `ACMT:${ticket.ticketCode}` : '';

  const formatMemberSince = (dateStr) => {
    if (!dateStr) return '2024';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Member Event Pass"
      description="Your permanent ACM AMTICS check-in ticket."
      size="sm"
    >
      <div className="py-2 flex flex-col items-center text-center">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center gap-3 animate-pulse">
            <div className="w-48 h-48 bg-slate-100 rounded-2xl" />
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        ) : isError || !ticket ? (
          <div className="py-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Failed to load ticket
            </h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Unable to generate your QR ticket. Please check your connection and try again.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* White Tile Card with QR */}
            <div className="w-full max-w-[280px] bg-gradient-to-b from-[#f8f6fe] to-white p-5 rounded-3xl border border-purple-100 shadow-lg shadow-purple-500/5 flex flex-col items-center mb-4">
              {/* Header Branding */}
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/acm_amtics_logo.png"
                  alt="ACM AMTICS"
                  className="w-6 h-6 object-contain rounded-full"
                />
                <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                  ACM AMTICS
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#6332ec]/10 text-[#6332ec]">
                  PASS
                </span>
              </div>

              {/* High Contrast White QR Tile */}
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                <QRCodeSVG
                  value={qrPayload}
                  size={190}
                  level="H"
                  includeMargin={true}
                  className="rounded-lg"
                />
              </div>

              {/* Member Details */}
              <div className="mt-4 text-center">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {ticket.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {ticket.year ? `${ticket.year} Year • ` : ''}
                  {ticket.department || 'AMTICS'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">
                  Member since {formatMemberSince(ticket.memberSince)}
                </p>
              </div>
            </div>

            {/* Instruction Footer */}
            <div className="bg-purple-50/60 border border-purple-100 rounded-xl px-4 py-2.5 max-w-[280px] w-full">
              <p className="text-[11px] font-semibold text-[#6332ec] flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Show this QR to the coordinator at the venue</span>
              </p>
            </div>
          </div>
        )}

        <div className="pt-5 w-full flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
