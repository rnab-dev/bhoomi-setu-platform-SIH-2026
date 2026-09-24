import { AppUser, OfficialProfile, Person } from '@prisma/client';

type PopulatedUser = AppUser & {
  officialProfile?: OfficialProfile | null;
  person?: Person | null;
};

/**
 * Returns a Prisma `where` clause fragment that restricts Parcels by the Official's jurisdiction.
 * Usage: prisma.parcel.findMany({ where: { ...parcelJurisdictionFilter(req.user), status: 'ACTIVE' } })
 */
export const parcelJurisdictionFilter = (user?: PopulatedUser) => {
  if (!user || user.user_type !== 'OFFICIAL' || !user.officialProfile) {
    return { id: 'unauthorized-no-access' }; // Fails query securely
  }
  
  const { role, jurisdiction_level, jurisdiction_id } = user.officialProfile;
  
  if (role === 'DOLR_ADMIN' || jurisdiction_level === 'NATIONAL') {
    return {}; // No filter, can see all
  }
  
  if (!jurisdiction_id) {
    return { id: 'unauthorized-missing-jurisdiction-id' };
  }

  // Determine filtering based on jurisdiction level
  switch (jurisdiction_level) {
    case 'STATE':
      return { village: { tehsil: { subDivision: { district: { state_id: jurisdiction_id } } } } };
    case 'DISTRICT':
      return { village: { tehsil: { subDivision: { district_id: jurisdiction_id } } } };
    case 'SUBDIVISION':
      return { village: { tehsil: { subDivision_id: jurisdiction_id } } };
    case 'TEHSIL':
      return { village: { tehsil_id: jurisdiction_id } };
    case 'VILLAGE':
      return { village_id: jurisdiction_id };
    default:
      return { id: 'unauthorized-unknown-jurisdiction' };
  }
};

/**
 * Returns a Prisma `where` clause fragment that restricts AcquisitionCases by the Official's jurisdiction.
 */
export const caseJurisdictionFilter = (user?: PopulatedUser) => {
  if (!user || user.user_type !== 'OFFICIAL' || !user.officialProfile) {
    return { id: 'unauthorized-no-access' };
  }
  
  const { role, jurisdiction_level, jurisdiction_id } = user.officialProfile;
  
  if (role === 'DOLR_ADMIN' || jurisdiction_level === 'NATIONAL') {
    return {}; 
  }
  
  if (!jurisdiction_id) return { id: 'unauthorized-missing-jurisdiction-id' };

  switch (jurisdiction_level) {
    case 'STATE':
      return { parcel: { village: { tehsil: { subDivision: { district: { state_id: jurisdiction_id } } } } } };
    case 'DISTRICT':
      return { parcel: { village: { tehsil: { subDivision: { district_id: jurisdiction_id } } } } };
    case 'SUBDIVISION':
      return { parcel: { village: { tehsil: { subDivision_id: jurisdiction_id } } } };
    case 'TEHSIL':
      return { parcel: { village: { tehsil_id: jurisdiction_id } } };
    case 'VILLAGE':
      return { parcel: { village_id: jurisdiction_id } };
    default:
      return { id: 'unauthorized-unknown-jurisdiction' };
  }
};
