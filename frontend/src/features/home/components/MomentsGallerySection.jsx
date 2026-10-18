import React, { useState } from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { galleryItems } from '../../../data/gallery';
import Modal from '../../../shared/components/ui/Modal';

export default function MomentsGallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const displayItems = galleryItems.slice(0, 7);

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              GALLERY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Moments from Our Journey
            </h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group cursor-pointer"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Gallery Grid matching screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Large Photo */}
          {displayItems[0] && (
            <div
              onClick={() => setSelectedPhoto(displayItems[0])}
              className="md:col-span-5 relative group rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-full cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={displayItems[0].image}
                alt={displayItems[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                <span className="text-xs font-semibold text-indigo-300">
                  {displayItems[0].category}
                </span>
                <h4 className="text-base font-bold text-white">
                  {displayItems[0].title}
                </h4>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-slate-700" />
              </div>
            </div>
          )}

          {/* Right Sub-grid of 6 Photos */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {displayItems.slice(1, 7).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className="relative group rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-semibold text-indigo-300">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <Modal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          title={selectedPhoto.title}
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-slate-950 max-h-[60vh] flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-indigo-600 px-2.5 py-1 bg-indigo-50 rounded-full">
                {selectedPhoto.category}
              </span>
              <span>{selectedPhoto.date}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedPhoto.description}
            </p>
          </div>
        </Modal>
      )}
    </section>
  );
}
