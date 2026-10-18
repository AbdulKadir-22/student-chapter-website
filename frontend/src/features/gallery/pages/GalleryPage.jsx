import React, { useState, useEffect } from 'react';
import { Camera, Maximize2, Calendar, Tag } from 'lucide-react';
import { getGalleryItems, galleryCategories } from '../services/galleryService';
import Modal from '../../../shared/components/ui/Modal';
import Badge from '../../../shared/components/ui/Badge';

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    getGalleryItems(activeCategory).then((data) => {
      setItems(data);
    });
  }, [activeCategory]);

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5" />
            Chapter Archives
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Moments from Our Journey
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Snapshots of our workshops, late-night hackathons, student meetups, and keynote lectures that define the ACM AMTICS spirit.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs">
          {galleryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/60"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="indigo" size="sm">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-slate-300">{item.date}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <Modal
          isOpen={!!activeModalItem}
          onClose={() => setActiveModalItem(null)}
          title={activeModalItem.title}
          className="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-slate-950 max-h-[65vh] flex items-center justify-center">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold text-slate-800">{activeModalItem.category}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeModalItem.date}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {activeModalItem.description}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
