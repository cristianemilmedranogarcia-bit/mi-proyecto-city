import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import SellerOfferManager from './SellerOfferManager';
import { ShoppingBag, PlusCircle, Tag } from 'lucide-react';

export const revalidate = 0;

export default async function SellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Get items listed by seller
  const items = await prisma.marketplaceItem.findMany({
    where: { sellerId: user.id },
    include: {
      category: true,
      offers: {
        include: { buyer: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Navbar currentUser={user} />
      <main className="container" style={{ padding: '2.5rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase' }}>
              <ShoppingBag size={16} /> Seller Control Hub
            </div>
            <h1 style={{ fontSize: '2rem', marginTop: '0.2rem' }}>Seller Dashboard</h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Manage your local marketplace listings and review buyer offers
            </p>
          </div>

          <Link href="/post/item" className="btn btn-primary btn-lg">
            <PlusCircle size={18} /> Sell an Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Tag size={28} />
            </div>
            <h3>No marketplace items listed yet</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '1.25rem' }}>
              List your electronics, furniture, or tools to sell to local neighbors.
            </p>
            <Link href="/post/item" className="btn btn-primary">
              List Your First Item
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <h2 style={{ fontSize: '1.3rem' }}>{item.title}</h2>
                      <span className={`badge ${item.status === 'SOLD' ? 'badge-hired' : 'badge-applied'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                      {item.price === 0 ? 'FREE' : `$${item.price}`} · {item.category?.name} · {item.viewsCount} views
                    </div>
                  </div>

                  <Link href={`/marketplace/${item.id}`} className="btn btn-outline btn-sm">
                    View Listing Page
                  </Link>
                </div>

                {/* Buyer Offers */}
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.8rem' }}>Buyer Offers ({item.offers.length})</h4>
                  {item.offers.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic' }}>
                      No offers received yet for this item.
                    </p>
                  ) : (
                    <div>
                      {item.offers.map((offer) => (
                        <SellerOfferManager key={offer.id} offer={offer} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <MobileNav />
    </>
  );
}
