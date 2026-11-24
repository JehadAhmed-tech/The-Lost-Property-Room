const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)

export const seedLost = [
  { id: 'L-1001', itemName: 'Black Backpack', category: 'Bag', color: 'Black', description: 'School books and exercise books inside', route: 'Rangpur', busTime: '6:00 PM', reportDate: daysAgo(2), reporterName: 'Nusrat Jahan', phone: '01700000001', status: 'Searching', type: 'lost' },
  { id: 'L-1002', itemName: 'Blue Water Bottle', category: 'Bottle', color: 'Blue', description: 'Metal bottle with a small sticker', route: 'Dhaka', busTime: '9:30 AM', reportDate: daysAgo(1), reporterName: 'Rahim Uddin', phone: '01700000002', status: 'Searching', type: 'lost' },
  { id: 'L-1003', itemName: 'Samsung Phone', category: 'Electronics', color: 'Silver', description: 'Samsung phone with a cracked case', route: 'Bogura', busTime: '2:00 PM', reportDate: daysAgo(5), reporterName: 'Tania Akter', phone: '01700000003', status: 'Possible match', type: 'lost' }
]

export const seedFound = [
  { id: 'F-2001', itemName: 'Dark Backpack', category: 'Bag', color: 'Dark grey', description: 'Found a backpack with some books inside', route: 'Rangpur', busTime: '6:10 PM', reportDate: daysAgo(2), reporterName: 'Driver Karim', phone: '01700000011', status: 'Possible match', type: 'found' },
  { id: 'F-2002', itemName: 'Android Phone', category: 'Electronics', color: 'Silver', description: 'Phone found under a passenger seat', route: 'Bogura', busTime: '2:15 PM', reportDate: daysAgo(5), reporterName: 'Staff Hasan', phone: '01700000012', status: 'Possible match', type: 'found' },
  { id: 'F-2003', itemName: 'Black Umbrella', category: 'Other', color: 'Black', description: 'Foldable umbrella', route: 'Dhaka', busTime: '11:00 AM', reportDate: daysAgo(3), reporterName: 'Driver Selim', phone: '01700000013', status: 'Stored', type: 'found' }
]

export const seedMatches = [
  { id: 'M-3001', lostId: 'L-1001', foundId: 'F-2001', lostItem: 'Black Backpack', foundItem: 'Dark Backpack', route: 'Rangpur', score: 92, reason: 'Similar category, colour, route and book description.', status: 'Pending review', createdAt: daysAgo(1) },
  { id: 'M-3002', lostId: 'L-1003', foundId: 'F-2002', lostItem: 'Samsung Phone', foundItem: 'Android Phone', route: 'Bogura', score: 84, reason: 'Similar electronics category, colour, route and time.', status: 'Pending review', createdAt: daysAgo(1) }
]

export const seedNotifications = [
  { id: 'N-1', title: 'Possible match found', message: 'Black Backpack may match Dark Backpack on the Rangpur route.', date: new Date().toISOString(), read: false, matchId: 'M-3001' },
  { id: 'N-2', title: 'New found item reported', message: 'A black umbrella was added to the property room.', date: daysAgo(3), read: true }
]