import { OpenAPIDefinitionClient } from "./openAPIDefinition.ts";

const baseUrl = "<BASE_URL>";
const openAPIDefinitionClient = new OpenAPIDefinitionClient({ baseUrl });

export default function () {
  let businessAccountId,
    locationId,
    updateOperatingHoursRequest,
    updateFacilitiesRequest,
    bookingRulesUpdateRequest,
    updateLogoRequest,
    completeClientRegistrationRequest,
    completeBusinessRegistrationRequest,
    eventId,
    headers,
    locationCreateRequestDTO,
    photoCreateRequest,
    sportConfigurationDTO,
    pricingRuleDTO,
    createCompleteLocationRequestDTO,
    clientId,
    clientProfileUpdateRequestDTO,
    locationUpdateRequest,
    businessUpdateRequest,
    id,
    businessId,
    photoId,
    configId,
    ruleId;

  /**
   *
   */
  businessAccountId = 374191092845129;
  locationId = 7531843849226449;

  const getOperatingHoursResponseData =
    openAPIDefinitionClient.getOperatingHours(businessAccountId, locationId);

  /**
   *
   */
  businessAccountId = 2588869635991540;
  locationId = 4955551200897355;
  updateOperatingHoursRequest = {
    hours: [],
  };

  const updateOperatingHoursResponseData =
    openAPIDefinitionClient.updateOperatingHours(
      businessAccountId,
      locationId,
      updateOperatingHoursRequest,
    );

  /**
   *
   */
  businessAccountId = 6739259107536344;
  locationId = 4571434084572690;

  const getFacilitiesResponseData = openAPIDefinitionClient.getFacilities(
    businessAccountId,
    locationId,
  );

  /**
   *
   */
  businessAccountId = 6811403649630163;
  locationId = 2771453190480440;
  updateFacilitiesRequest = {
    facilityIds: [],
  };

  const updateFacilitiesResponseData = openAPIDefinitionClient.updateFacilities(
    businessAccountId,
    locationId,
    updateFacilitiesRequest,
  );

  /**
   *
   */
  businessAccountId = 3531277782867274;
  locationId = 3565134733891939;
  bookingRulesUpdateRequest = {
    maxBookingAdvanceDays: 427582698381616,
    cancellationPolicy: "FLEXIBLE",
  };

  const updateBookingRulesResponseData =
    openAPIDefinitionClient.updateBookingRules(
      businessAccountId,
      locationId,
      bookingRulesUpdateRequest,
    );

  /**
   * Update business logo URL
   */
  updateLogoRequest = {
    logoUrl: "taxicab",
  };

  const updateBusinessLogoResponseData =
    openAPIDefinitionClient.updateBusinessLogo(updateLogoRequest);

  /**
   *
   */
  completeClientRegistrationRequest = {
    firstName: "clamor",
    lastName: "joyfully",
    email: "glider",
    password: "angrily",
    profilePhotoUrl: "zany",
    bio: "up",
  };

  const registerClientResponseData = openAPIDefinitionClient.registerClient(
    completeClientRegistrationRequest,
  );

  /**
   *
   */
  completeBusinessRegistrationRequest = {
    firstName: "huzzah",
    lastName: "eminent",
    email: "cap",
    password: "gosh",
    businessName: "about",
    businessDescription: "signature",
    locationName: "rebuild",
    locationAddress: "huzzah",
  };

  const registerBusinessResponseData = openAPIDefinitionClient.registerBusiness(
    completeBusinessRegistrationRequest,
  );

  /**
   * Join an event (for authenticated clients)
   */
  eventId = 8883706351563315;
  headers = {
    "X-User-Id": 6334050100229248,
  };

  const joinEventResponseData = openAPIDefinitionClient.joinEvent(
    eventId,
    headers,
  );

  /**
   * Leave an event (for authenticated clients)
   */
  eventId = 3592797219472817;
  headers = {
    "X-User-Id": 6884332616411113,
  };

  const leaveEventResponseData = openAPIDefinitionClient.leaveEvent(
    eventId,
    headers,
  );

  /**
   *
   */
  businessAccountId = 3311906861610734;

  const getAllLocationsForBusinessResponseData =
    openAPIDefinitionClient.getAllLocationsForBusiness(businessAccountId);

  /**
   *
   */
  businessAccountId = 3245390881124602;
  locationCreateRequestDTO = {
    name: "plain",
    address: "beard",
    latitude: 1225790428022642,
    longitude: 2462577367140060,
    businessId: 8830712689164479,
  };

  const createLocationResponseData = openAPIDefinitionClient.createLocation(
    businessAccountId,
    locationCreateRequestDTO,
  );

  /**
   *
   */
  businessAccountId = 3996590819706509;
  locationId = 1535430922380252;
  photoCreateRequest = {
    url: "design",
    description: "tuba",
  };

  const addPhotoResponseData = openAPIDefinitionClient.addPhoto(
    businessAccountId,
    locationId,
    photoCreateRequest,
  );

  /**
   *
   */
  businessAccountId = 5628153852908031;
  locationId = 1178558517857468;
  sportConfigurationDTO = {
    id: 7577806682720443,
    sportName: "down",
    surfaceType: "crystallize",
    recommendedCapacity: "fashion",
    minBookingDuration: 130333805528633,
    bookingSlotIncrement: 2972646111236305,
  };

  const addSportConfigurationResponseData =
    openAPIDefinitionClient.addSportConfiguration(
      businessAccountId,
      locationId,
      sportConfigurationDTO,
    );

  /**
   *
   */
  businessAccountId = 8869775814289699;
  locationId = 3910428764214876;
  pricingRuleDTO = {
    id: 6924839011312533,
    ruleName: "geez",
    daysOfWeek: [],
    startTime: {
      hour: 3327779224304228,
      minute: 4337209586369354,
      second: 1434651916108921,
      nano: 3533307284956540,
    },
    endTime: {
      hour: 7910323455712385,
      minute: 7439258882259909,
      second: 3334864133472972,
      nano: 2679239012676694,
    },
    pricePerHour: 7728799343476165,
  };

  const addPricingRuleResponseData = openAPIDefinitionClient.addPricingRule(
    businessAccountId,
    locationId,
    pricingRuleDTO,
  );

  /**
   *
   */
  businessAccountId = 1473708644260702;
  createCompleteLocationRequestDTO = {
    name: "whoa",
    address: "passionate",
    latitude: 3439811243572998,
    longitude: 8939172865502085,
    photos: [],
    operatingHours: [],
    facilityIds: [],
    pricingRules: [],
    sportConfigurations: [],
    bookingRules: {
      maxBookingAdvanceDays: 3221421460893039,
      cancellationPolicy: "FLEXIBLE",
    },
  };

  const createCompleteLocationResponseData =
    openAPIDefinitionClient.createCompleteLocation(
      businessAccountId,
      createCompleteLocationRequestDTO,
    );

  /**
   * Add a new photo to the business profile
   */
  photoCreateRequest = {
    url: "underneath",
    description: "sandbar",
  };

  const addPhoto1ResponseData =
    openAPIDefinitionClient.addPhoto1(photoCreateRequest);

  /**
   *
   */
  clientId = 4310513711625609;

  const getCurrentUserProfileResponseData =
    openAPIDefinitionClient.getCurrentUserProfile(clientId);

  /**
   *
   */
  clientId = 4975502125460734;

  const deleteCurrentUserProfileResponseData =
    openAPIDefinitionClient.deleteCurrentUserProfile(clientId);

  /**
   *
   */
  clientId = 5763672389609137;
  clientProfileUpdateRequestDTO = {
    firstName: "provided",
    lastName: "geez",
    profilePhotoUrl: "unaccountably",
    bio: "antelope",
    favoriteSports: "tribe",
  };

  const updateCurrentUserProfileResponseData =
    openAPIDefinitionClient.updateCurrentUserProfile(
      clientId,
      clientProfileUpdateRequestDTO,
    );

  /**
   *
   */
  businessAccountId = 4614085504964336;
  locationId = 2810270537887632;

  const getLocationByIdResponseData = openAPIDefinitionClient.getLocationById(
    businessAccountId,
    locationId,
  );

  /**
   *
   */
  businessAccountId = 5760790909771756;
  locationId = 3885200597245238;

  const deleteLocationResponseData = openAPIDefinitionClient.deleteLocation(
    businessAccountId,
    locationId,
  );

  /**
   *
   */
  businessAccountId = 8754272382527488;
  locationId = 5614245855908914;
  locationUpdateRequest = {
    name: "off",
    address: "guzzle",
    latitude: 5477187340972635,
    longitude: 5956052688839877,
  };

  const updateLocationDetailsResponseData =
    openAPIDefinitionClient.updateLocationDetails(
      businessAccountId,
      locationId,
      locationUpdateRequest,
    );

  /**
   * Get current business profile details
   */

  const getCurrentBusinessProfileResponseData =
    openAPIDefinitionClient.getCurrentBusinessProfile();

  /**
   * Update business details (partial update)
   */
  businessUpdateRequest = {
    name: "yet",
    logoUrl: "ultimately",
    description: "er",
    websiteUrl: "supposing",
    phoneNumber: "whoa",
    email: "lest",
  };

  const updateBusinessDetailsResponseData =
    openAPIDefinitionClient.updateBusinessDetails(businessUpdateRequest);

  /**
   *
   */
  headers = {
    "X-User-Id": 970817114470860,
  };

  const getMyUserTypeResponseData =
    openAPIDefinitionClient.getMyUserType(headers);

  /**
   *
   */

  const getAllLocationsResponseData = openAPIDefinitionClient.getAllLocations();

  /**
   *
   */
  id = 1591345759689612;

  const getLocationDetailsResponseData =
    openAPIDefinitionClient.getLocationDetails(id);

  /**
   * Get a list of all upcoming public events
   */

  const getAllUpcomingEventsResponseData =
    openAPIDefinitionClient.getAllUpcomingEvents();

  /**
   * Get detailed information about a specific event
   */
  eventId = 7506301301295837;

  const getEventDetailsResponseData =
    openAPIDefinitionClient.getEventDetails(eventId);

  /**
   * Get all events the current client is participating in
   */
  headers = {
    "X-User-Id": 1441088928058922,
  };

  const getMyParticipationsResponseData =
    openAPIDefinitionClient.getMyParticipations(headers);

  /**
   *
   */

  const searchBusinessesResponseData =
    openAPIDefinitionClient.searchBusinesses();

  /**
   *
   */
  id = 8136073157274111;

  const getBusinessByIdResponseData =
    openAPIDefinitionClient.getBusinessById(id);

  /**
   *
   */
  businessAccountId = 2269942328802450;
  locationId = 3679476583600738;

  const getSportConfigurationResponseData =
    openAPIDefinitionClient.getSportConfiguration(
      businessAccountId,
      locationId,
    );

  /**
   *
   */
  businessAccountId = 3057291522067978;

  const getAllBusinessPhotosResponseData =
    openAPIDefinitionClient.getAllBusinessPhotos(businessAccountId);

  /**
   * Get all locations for the current business
   */

  const getMyBusinessLocationsResponseData =
    openAPIDefinitionClient.getMyBusinessLocations();

  /**
   *
   */
  businessId = 2778477747620356;

  const unregisterBusinessResponseData =
    openAPIDefinitionClient.unregisterBusiness(businessId);

  /**
   *
   */
  businessAccountId = 7944162595262977;
  locationId = 2336381331452275;
  photoId = 8833659118625433;

  const deletePhotoResponseData = openAPIDefinitionClient.deletePhoto(
    businessAccountId,
    locationId,
    photoId,
  );

  /**
   *
   */
  businessAccountId = 1634868086520752;
  locationId = 2032038918697653;
  configId = 7012850743616340;

  const deleteSportConfigurationResponseData =
    openAPIDefinitionClient.deleteSportConfiguration(
      businessAccountId,
      locationId,
      configId,
    );

  /**
   *
   */
  businessAccountId = 6092612278949188;
  locationId = 4269940532878569;
  ruleId = 8786475582458582;

  const deletePricingRuleResponseData =
    openAPIDefinitionClient.deletePricingRule(
      businessAccountId,
      locationId,
      ruleId,
    );

  /**
   * Delete a photo by its ID
   */
  photoId = 1859262693603775;

  const deletePhoto1ResponseData =
    openAPIDefinitionClient.deletePhoto1(photoId);
}
