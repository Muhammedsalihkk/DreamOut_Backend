import fs from 'fs';
import path from 'path';
import { prisma, connectDatabase, disconnectDatabase } from './prisma';

async function importData() {
  console.log('🚀 Starting data import to Neon DB...');

  await connectDatabase();

  const sqlFilePath = path.resolve(process.cwd(), '..', 'dreamout_inserts.sql');
  if (!fs.existsSync(sqlFilePath)) {
    console.error('❌ SQL dump file not found at:', sqlFilePath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(sqlFilePath, 'utf-8');

  // Parse lines starting with INSERT INTO
  const lines = fileContent.split('\n');
  const insertStatements: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('INSERT INTO public.users') ||
        line.startsWith('INSERT INTO public.routes') ||
        line.startsWith('INSERT INTO public.spots') ||
        line.startsWith('INSERT INTO public.journeys') ||
        line.startsWith('INSERT INTO public.journey_moments')) {
      insertStatements.push(line);
    }
  }

  console.log(`📦 Found ${insertStatements.length} records to import.`);

  // Execute in order: users first, then routes, spots, journeys, moments
  const userInserts = insertStatements.filter(s => s.startsWith('INSERT INTO public.users'));
  const routeInserts = insertStatements.filter(s => s.startsWith('INSERT INTO public.routes'));
  const spotInserts = insertStatements.filter(s => s.startsWith('INSERT INTO public.spots'));
  const journeyInserts = insertStatements.filter(s => s.startsWith('INSERT INTO public.journeys'));
  const momentInserts = insertStatements.filter(s => s.startsWith('INSERT INTO public.journey_moments'));

  let importedCount = 0;

  // 1. Users
  console.log(`👤 Importing ${userInserts.length} users...`);
  for (const stmt of userInserts) {
    try {
      // Use ON CONFLICT (id) DO NOTHING so it's idempotent
      const safeStmt = stmt.replace(/;\s*$/, '') + ' ON CONFLICT (id) DO NOTHING;';
      await prisma.$executeRawUnsafe(safeStmt);
      importedCount++;
    } catch (err: any) {
      console.warn('Warning inserting user:', err.message);
    }
  }

  // 2. Routes
  console.log(`🗺️  Importing ${routeInserts.length} routes...`);
  for (const stmt of routeInserts) {
    try {
      const safeStmt = stmt.replace(/;\s*$/, '') + ' ON CONFLICT (id) DO NOTHING;';
      await prisma.$executeRawUnsafe(safeStmt);
      importedCount++;
    } catch (err: any) {
      console.warn('Warning inserting route:', err.message);
    }
  }

  // 3. Spots
  console.log(`📍 Importing ${spotInserts.length} spots...`);
  for (const stmt of spotInserts) {
    try {
      const safeStmt = stmt.replace(/;\s*$/, '') + ' ON CONFLICT (id) DO NOTHING;';
      await prisma.$executeRawUnsafe(safeStmt);
      importedCount++;
    } catch (err: any) {
      console.warn('Warning inserting spot:', err.message);
    }
  }

  // 4. Journeys
  for (const stmt of journeyInserts) {
    try {
      const safeStmt = stmt.replace(/;\s*$/, '') + ' ON CONFLICT (id) DO NOTHING;';
      await prisma.$executeRawUnsafe(safeStmt);
      importedCount++;
    } catch (err: any) {
      console.warn('Warning inserting journey:', err.message);
    }
  }

  // 5. Moments
  for (const stmt of momentInserts) {
    try {
      const safeStmt = stmt.replace(/;\s*$/, '') + ' ON CONFLICT (id) DO NOTHING;';
      await prisma.$executeRawUnsafe(safeStmt);
      importedCount++;
    } catch (err: any) {
      console.warn('Warning inserting moment:', err.message);
    }
  }

  // Update autoincrement sequences so new inserts don't collide
  console.log('🔄 Updating PostgreSQL sequence values...');
  const sequences = [
    { table: 'users', seq: 'users_id_seq' },
    { table: 'routes', seq: 'routes_id_seq' },
    { table: 'spots', seq: 'spots_id_seq' },
  ];

  for (const { table, seq } of sequences) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM "${table}";`
      );
    } catch (err: any) {
      // Fallback direct setval
      try {
        await prisma.$executeRawUnsafe(
          `SELECT setval('${seq}', (SELECT COALESCE(MAX(id), 1) FROM "${table}"));`
        );
      } catch (e) {
        // Ignored if sequence already synchronized
      }
    }
  }

  // Verify counts in Neon DB
  const userCount = await prisma.user.count();
  const routeCount = await prisma.route.count();
  const spotCount = await prisma.spot.count();

  console.log('🎉 Data migration to Neon DB completed successfully!');
  console.log(`   - Users in Neon: ${userCount}`);
  console.log(`   - Routes in Neon: ${routeCount}`);
  console.log(`   - Spots in Neon: ${spotCount}`);

  await disconnectDatabase();
}

importData().catch(async (e) => {
  console.error('❌ Data import failed:', e);
  await disconnectDatabase();
  process.exit(1);
});

