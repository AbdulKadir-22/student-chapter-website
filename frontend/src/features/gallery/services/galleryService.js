import { galleryItems, galleryCategories } from '../../../data/gallery';

export async function getGalleryItems(category = 'All') {
  if (!category || category === 'All') {
    return galleryItems;
  }
  return galleryItems.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
}

export { galleryCategories };
