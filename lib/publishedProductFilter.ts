/** Published, customer-visible products (shop + homepage). */
export const publishedProductFilter = {
  isActive: true,
  isHidden: { $ne: true },
  isArchived: { $ne: true },
  $or: [{ status: "Published" }, { status: { $exists: false } }],
  $and: [
    {
      $or: [
        { sellerId: null },
        { sellerId: { $exists: false } },
        { approvalStatus: "approved" },
      ],
    },
  ],
};
