-- ============================================================
-- Nomichi Trip Desk — Seed Data
-- Run AFTER running the migration AND creating your first admin user.
-- The leads reference profile IDs; update owner_id after you sign up.
-- ============================================================

insert into public.trips (id, name, destination, start_date, end_date, price_inr, total_seats, status, description)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Spiti in Winter',
    'Spiti Valley, Himachal Pradesh',
    '2025-02-15', '2025-02-22',
    28500, 10, 'open',
    'A slow week in snow-covered Spiti. Monastery mornings, frozen rivers, wide silences. Small group, simple stays, no itinerary that cannot bend.'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Hampi Long Weekend',
    'Hampi, Karnataka',
    '2025-03-07', '2025-03-10',
    14500, 12, 'open',
    'Three days among the boulders and ruins. A place best understood on foot. We stay in a small guesthouse by the river and let Hampi do the rest.'
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Dzukou Valley Trek',
    'Nagaland',
    '2025-04-12', '2025-04-18',
    22000, 8, 'open',
    'Six days through a valley most people cannot place on a map. Wildflowers are out in April. You carry your own pack, share a camp, and earn every view.'
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Majuli Island Stay',
    'Majuli, Assam',
    '2025-01-18', '2025-01-23',
    18500, 10, 'closed',
    'Five days on the largest river island in the world. Mask-making in a sattra, morning river fog, a rhythm that does not match any other trip we run.'
  );


-- Sample leads (owner_id left null — assign after creating your admin account)
insert into public.leads (trip_id, name, phone, email, group_type, preferred_month, vibe_text, status)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Ananya Krishnan',
    '+91 98765 43210',
    'ananya.k@gmail.com',
    'solo',
    'February 2025',
    'Something quiet. I want to feel small in a landscape for once.',
    'new'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Rohan and Priya Mehta',
    '+91 87654 32109',
    'rohan.mehta@outlook.com',
    'couple',
    'March 2025',
    'We have done Goa too many times. We want something that surprises us.',
    'contacted'
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Siddharth Nair',
    '+91 76543 21098',
    'sid.nair@hey.com',
    'friends',
    'April 2025',
    'Four of us who want a proper trek but also good conversation around a fire.',
    'qualified'
  ),
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Kavya Reddy',
    '+91 65432 10987',
    'kavya.r@proton.me',
    'solo',
    'February 2025',
    'A reset. I work in tech and I need a week where I do not look at a screen.',
    'vibe_check_sent'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'The Sharma Family',
    '+91 54321 09876',
    'rakesh.sharma@gmail.com',
    'family',
    'March 2025',
    'Looking for something our kids will remember. Not a resort trip.',
    'not_a_fit'
  );
