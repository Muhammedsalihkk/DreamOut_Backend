import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial spots and routes...');

  // Ensure default demo user exists
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'traveler@dreamout.com',
        name: 'Alex Rivera',
        password: 'password123',
      },
    });
  }

  // Check existing spots count
  const spotsCount = await prisma.spot.count();
  if (spotsCount === 0) {
    console.log('Creating initial Munnar spots...');
    const INITIAL_SPOTS = [
      {
        name: 'Kolukkumalai View Point',
        category: 'Viewpoint',
        location: 'Munnar, Idukki',
        description: 'The highest tea estate in the world offering breathtaking sunrise views above the cloud line.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        latitude: 10.0889,
        longitude: 77.0595,
      },
      {
        name: 'Attukal Waterfalls',
        category: 'Waterfall',
        location: 'Munnar, Idukki',
        description: 'A roaring waterfall surrounded by rolling hills and dense green forests between Munnar and Pallivasal.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        latitude: 10.0536,
        longitude: 77.0543,
      },
      {
        name: 'Tea Gardens Trail',
        category: 'Tea Garden',
        location: 'Munnar, Idukki',
        description: 'Vast emerald green tea plantations with walking paths cutting through organic tea bushes.',
        image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
        latitude: 10.0754,
        longitude: 77.0622,
      },
      {
        name: 'Echo Point',
        category: 'Viewpoint',
        location: 'Munnar, Idukki',
        description: 'Picturesque spot where voices echo back natural acoustics across the misty mountain lake.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        latitude: 10.1264,
        longitude: 77.1485,
      },
      {
        name: 'Top Station',
        category: 'Viewpoint',
        location: 'Munnar, Idukki',
        description: 'Highest point in Munnar on the Kerala-Tamil Nadu border offering panoramic valley vistas.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        latitude: 10.1228,
        longitude: 77.2435,
      },
      {
        name: 'Mattupetty Dam',
        category: 'Lake',
        location: 'Munnar, Idukki',
        description: 'Serene storage reservoir nestled in the hills of Munnar, popular for boating and elephant sightings.',
        image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=800&q=80',
        latitude: 10.1066,
        longitude: 77.1248,
      },
      {
        name: 'Forest Walk',
        category: 'Nature',
        location: 'Munnar, Idukki',
        description: 'Peaceful shaded trail beneath eucalyptus trees and high altitude mountain vegetation.',
        image: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=800&q=80',
        latitude: 10.0912,
        longitude: 77.0811,
      },
      {
        name: 'Sunset Rock',
        category: 'Viewpoint',
        location: 'Munnar, Idukki',
        description: 'Dramatic granite cliff edge where travelers gather to watch golden mountain sunsets.',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        latitude: 10.0652,
        longitude: 77.0421,
      },
    ];

    for (const spot of INITIAL_SPOTS) {
      await prisma.spot.create({
        data: {
          ...spot,
          userId: user.id,
        },
      });
    }
    console.log(`Created ${INITIAL_SPOTS.length} spots.`);
  }

  // Check existing routes count
  const routesCount = await prisma.route.count();
  if (routesCount === 0) {
    console.log('Creating initial Munnar routes...');
    const allSpots = await prisma.spot.findMany();
    const formattedPlaces = allSpots.slice(0, 6).map((s, idx) => ({
      id: `p-${idx + 1}`,
      spotId: String(s.id),
      order: idx + 1,
      name: s.name,
      category: s.category,
      location: s.location || 'Munnar, Idukki',
      distanceFromStart: idx === 0 ? '0 km' : `${(idx * 1.8).toFixed(1)} km`,
      image: s.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    }));

    await prisma.route.create({
      data: {
        userId: user.id,
        title: 'Munnar Tea Trails & Waterfalls',
        coverImage: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'Explore the scenic tea gardens, misty viewpoints, and roaring waterfalls of Munnar.',
        description: 'A 2-day immersive journey through high-altitude tea plantations, cascading waterfalls, and panoramic Western Ghats vistas.',
        location: 'Munnar, Idukki',
        category: 'Nature & Trekking',
        difficulty: 'Moderate',
        visibility: 'Public',
        distance: '18.4 km',
        duration: '5–6 hours',
        places: formattedPlaces,
        highlights: [
          'Kolukkumalai Sunrise',
          'Attukal Waterfalls Cascade',
          'Tea Tasting & Plantations',
          'Echo Point Acoustics',
        ],
        likesCount: 142,
        commentsCount: 36,
      },
    });

    await prisma.route.create({
      data: {
        userId: user.id,
        title: 'Top Station Cloud Valley Trek',
        coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        shortDescription: 'High altitude mountain trek overlooking cloud-blanketed valleys on the border of Kerala and Tamil Nadu.',
        description: 'Spectacular trek climbing up to Top Station with views of the rare Neelakurinji blooms and rugged ridges.',
        location: 'Top Station, Munnar',
        category: 'Mountain Trail',
        difficulty: 'Challenging',
        visibility: 'Public',
        distance: '12.8 km',
        duration: '4–5 hours',
        places: formattedPlaces.slice(0, 4),
        highlights: ['Border Panoramic View', 'Cloud Layer Hike', 'Cliff Edge Views'],
        likesCount: 98,
        commentsCount: 19,
      },
    });

    console.log('Created initial Munnar routes.');
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
