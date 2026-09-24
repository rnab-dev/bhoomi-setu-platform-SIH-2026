import { PrismaClient, UserType, OfficialRole, JurisdictionLevel, LandType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Phase 8 Architecture...');

  // 1. Create Base Geography
  const state = await prisma.state.upsert({
    where: { name: 'DemoState' },
    update: {},
    create: { name: 'DemoState' },
  });

  const district = await prisma.district.upsert({
    where: { state_id_name: { state_id: state.id, name: 'DemoDistrict' } },
    update: {},
    create: { state_id: state.id, name: 'DemoDistrict' },
  });

  const subDivision = await prisma.subDivision.upsert({
    where: { district_id_name: { district_id: district.id, name: 'DemoSubDivision' } },
    update: {},
    create: { district_id: district.id, name: 'DemoSubDivision' },
  });

  const tehsil = await prisma.tehsil.upsert({
    where: { subDivision_id_name: { subDivision_id: subDivision.id, name: 'DemoTehsil' } },
    update: {},
    create: { subDivision_id: subDivision.id, name: 'DemoTehsil' },
  });

  const village = await prisma.village.upsert({
    where: { tehsil_id_name: { tehsil_id: tehsil.id, name: 'DemoVillage' } },
    update: {},
    create: { tehsil_id: tehsil.id, name: 'DemoVillage' },
  });

  // 2. Create Project
  const project = await prisma.project.upsert({
    where: { reference_code: 'PRJ-DEMO-001' },
    update: {},
    create: {
      reference_code: 'PRJ-DEMO-001',
      title: 'Demo Highway Expansion',
      purpose: 'Infrastructure',
      state_id: state.id,
      district_id: district.id,
    },
  });

  // 3. Create Demo Citizens
  const citizenPerson = await prisma.person.create({
    data: {
      full_name: 'Ramesh Citizen',
      email: 'citizen.ramesh@demo.bhoomisetu.in',
      appUser: {
        create: {
          auth_user_id: 'citizen-auth-uuid-1',
          user_type: UserType.CITIZEN,
        }
      }
    }
  });

  // 4. Create Demo Parcels & Acquisition Cases
  const parcel = await prisma.parcel.upsert({
    where: { village_id_survey_number: { village_id: village.id, survey_number: 'SVY-001' } },
    update: {},
    create: {
      survey_number: 'SVY-001',
      village_id: village.id,
      area_hectares: 1.5,
      land_type: LandType.RURAL,
      owners: {
        create: {
          person_id: citizenPerson.id,
          share_percentage: 100.0,
          ownership_type: 'PRIMARY'
        }
      }
    }
  });

  await prisma.acquisitionCase.upsert({
    where: { project_id_parcel_id: { project_id: project.id, parcel_id: parcel.id } },
    update: {},
    create: {
      project_id: project.id,
      parcel_id: parcel.id,
    }
  });

  // 5. Create Demo Officials
  const createOfficial = async (email: string, role: OfficialRole, level: JurisdictionLevel, jurisdictionId: string | null, authId: string) => {
    return await prisma.appUser.create({
      data: {
        auth_user_id: authId,
        user_type: UserType.OFFICIAL,
        officialProfile: {
          create: {
            role,
            jurisdiction_level: level,
            jurisdiction_id: jurisdictionId
          }
        }
      }
    });
  };

  await createOfficial('admin.dolr@demo.bhoomisetu.in', OfficialRole.DOLR_ADMIN, JurisdictionLevel.NATIONAL, null, 'auth-dolr-1');
  await createOfficial('dir.land@demo.bhoomisetu.in', OfficialRole.STATE_OFFICER, JurisdictionLevel.STATE, state.id, 'auth-state-1');
  await createOfficial('dm.district_1@demo.bhoomisetu.in', OfficialRole.DISTRICT_OFFICER, JurisdictionLevel.DISTRICT, district.id, 'auth-dist-1');
  await createOfficial('lao.tehsil_a@demo.bhoomisetu.in', OfficialRole.LAO, JurisdictionLevel.TEHSIL, tehsil.id, 'auth-lao-1');
  await createOfficial('field.north@demo.bhoomisetu.in', OfficialRole.FIELD_OFFICER, JurisdictionLevel.VILLAGE, village.id, 'auth-field-1');

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
