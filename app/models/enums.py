import enum


class ArtworkStatus(str, enum.Enum):
    IN_GALLERY = "В галерее"
    ON_EXHIBITION = "На выставке"
    IN_STORAGE = "На хранении"


class ExhibitionStatus(str, enum.Enum):
    PAST = "Прошедшая"
    CURRENT = "Текущая"
    UPCOMING = "Предстоящая"


class InquiryStatus(str, enum.Enum):
    NEW = "Новое"
    READ = "Прочитано"
    RESPONDED = "Отвечено"


class UserRole(str, enum.Enum):
    STAFF = "staff"
    ADMIN = "admin"
