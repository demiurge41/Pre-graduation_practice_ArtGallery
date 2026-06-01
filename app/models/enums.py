import enum


class ArtworkStatus(str, enum.Enum):
    IN_GALLERY = "In Gallery"
    ON_EXHIBITION = "On Exhibition"
    IN_STORAGE = "In Storage"


class ExhibitionStatus(str, enum.Enum):
    PAST = "Past"
    CURRENT = "Current"
    UPCOMING = "Upcoming"


class InquiryStatus(str, enum.Enum):
    NEW = "New"
    READ = "Read"
    RESPONDED = "Responded"


class UserRole(str, enum.Enum):
    STAFF = "staff"
    ADMIN = "admin"
