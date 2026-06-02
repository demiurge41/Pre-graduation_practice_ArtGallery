"""Перевод существующих данных БД с английского на русский."""
from uuid import UUID

from app.database import SessionLocal
from app.models import Artist, Artwork, Exhibition, Inquiry
from app.models.enums import ArtworkStatus, ExhibitionStatus, InquiryStatus

MEDIUM_MAP = {
    "Oil on Canvas": "Масло на холсте",
    "Oil on oak panel": "Масло на дубовой панели",
}

ARTISTS_BY_ID = {
    "18f805fd-c0ca-4b16-9e93-df98eab9e5fe": {
        "full_name": "Питер Саенредам",
        "biography": (
            "Саенредам родился в Ассендельфте, сын гравёра и рисовальщика Яна Питерса "
            "Саенредама. В 1612 году переехал в Харлем, учился у Франса де Греббера. "
            "В 1623 году вступил в гильдию св. Луки. Умер в Харлеме."
        ),
    },
    "a1b5fb64-a78b-4da1-80e4-5eaf39e2504f": {
        "full_name": "Якоб ван Рейсдал",
        "biography": (
            "Якоб Исааксзон ван Рейсдал родился в Харлеме около 1628 года в семье "
            "пейзажистов. Его работы — важная часть голландского золотого века живописи."
        ),
    },
    "98c5be30-48e9-4a2a-9f18-cb798024eae2": {
        "full_name": "Джованни Антонио Каналетто",
        "biography": (
            "Родился в Венеции, сын художника Бернардо Канала, откуда прозвище Каналетто. "
            "Прославился ведутами — точными городскими панорамами Венеции."
        ),
    },
    "55ffb2de-48d9-460b-933c-c30e330f7ed6": {
        "full_name": "Каспар Давид Фридрих",
        "biography": (
            "Немецкий романтический пейзажист, один из главных художников своего поколения. "
            "Его полотна передают созерцательное отношение к природе."
        ),
    },
    "59395fa3-d153-42d6-a196-8122c7f484a0": {
        "full_name": "Альберт Бирштадт",
        "biography": (
            "Немецко-американский художник, известный монументальными пейзажами американского "
            "Запада. Участвовал в экспедициях на запад, чтобы писать сцены с натуры."
        ),
    },
}

ARTWORKS_BY_ID = {
    "20496ecd-2f27-420e-b326-460766d9b5ef": {
        "title": "Интерьер церкви Синт-Одулфус в Ассендельфте",
        "description": "Строгая перспективная сцена интерьера церкви во время проповеди.",
        "creation_story": (
            "Картина 1649 года Питера Янса Саенредама. Хранится в Рейксмузее, Амстердам."
        ),
    },
    "40a8a5ef-b663-462f-8bed-cdd8394f642a": {
        "title": "Мельница в Вейк-бай-Дюрстеде",
        "description": "Низинный пейзаж с массивной мельницей под грозовым небом.",
        "creation_story": "Полотно Якоба ван Рейсдала (ок. 1670), пример живописи золотого века Голландии.",
    },
    "f98ef40a-f93e-4cc9-b98a-25cdea72492b": {
        "title": "Вид на Харлем с белильными полями",
        "description": "Панорама города вдали с широким небом и ровной местностью.",
        "creation_story": "Пейзаж Якоба ван Рейсдала (ок. 1670–1675) в традиции «харлемских видов».",
    },
    "f9923883-dbed-448e-84b4-6b1b9260d905": {
        "title": "Большой канал в Венеции",
        "description": "Светлый детализированный городской вид с архитектурой и гондолами.",
        "creation_story": "Верхняя часть Большого канала — типичная ведута для путешественников Grand Tour.",
    },
    "48714914-aebb-4df9-890a-b10eb804275f": {
        "title": "Руины и античные постройки",
        "description": "Воображаемый пейзаж, сочетающий римские руины и современные фигуры.",
        "creation_story": "В духе каприччо XVIII века — реальные итальянские мотивы и вымышленные руины.",
    },
    "8f33e3de-841c-4dd3-8c03-9cf8f26a0faf": {
        "title": "Часовня колледжа Итон",
        "description": "Спокойный пейзаж с исторической британской архитектурой под мягким небом.",
        "creation_story": "Пейзаж 1754 года с видом на колледж Итон с берега Темзы.",
    },
    "65f89222-0d68-4ba3-873a-005b90dc67c2": {
        "title": "Аббатство в дубовой роще",
        "description": "Мрачный пейзаж с готическими руинами и голыми деревьями в сумерках.",
        "creation_story": "Картина Каспара Давида Фридриха (1809–1810), выставлялась с «Монахом у моря».",
    },
    "5cff4dc6-00a5-4c61-804d-96e57946367d": {
        "title": "Странник над морем тумана",
        "description": "Одинокая фигура на скале над бескрайним горным туманом.",
        "creation_story": "Шедевр романтизма и один из самых известных «фигур со спины» в живописи.",
    },
    "b9551667-f437-49f7-b33e-e641af82054f": {
        "title": "Меловые скалы Рюгена",
        "description": "Драматический вид на море, обрамлённый деревьями.",
        "creation_story": "Написана после свадебного путешествия на Рюген в 1818 году.",
    },
    "c1eb6f94-e0e4-44ba-a6c4-fe2c06b4b3ca": {
        "title": "Скалистые горы, пик Ландера",
        "description": "Монументальный пейзаж дикой природы с лагерем коренных народов.",
        "creation_story": "Бирштадт родился в Германии, вырос в США и стал мастером пейзажа Запада.",
    },
    "3992c39a-be5f-4d57-9b20-5470f365aa2c": {
        "title": "Среди гор Сьерра-Невада, Калифорния",
        "description": "Горное озеро в сиянии света — возвышенная, нетронутая природа.",
        "creation_story": "Эскизы с экспедиции 1859 года для железной дороги через Скалистые горы.",
    },
    "58a56f3a-5469-4b6d-b54b-5fc1bfc35419": {
        "title": "Гроза в Скалистых горах, гора Розали",
        "description": "Театральная композиция с надвигающейся грозой над горными долинами.",
        "creation_story": "Пейзаж 1866 года по мотивам экспедиции 1863 года.",
    },
}

EXHIBITIONS_BY_ID = {
    "3f0aa79d-f7cd-4052-b99f-18187db789db": {
        "title": "Архитектура света: от золотого века к романтизму",
        "description": (
            "Как мастера разных эпох использовали свет, превращая интерьеры и панорамы "
            "в духовный опыт."
        ),
    },
    "8f645cd7-59f5-4a1e-aa38-b0af38f39401": {
        "title": "Тихие горизонты: эхо природы и времени",
        "description": "От соборных залов к дикой природе — диалог творения и возвышенного мира.",
    },
    "70d2a2e3-b8b6-4595-b000-50f31a0a71d8": {
        "title": "Великая традиция: три века пейзажных шедевров",
        "description": (
            "От голландских мастеров XVII века до драматического романтизма XIX века."
        ),
    },
}

def localize():
    db = SessionLocal()
    try:
        n = 0

        artwork_status_map = {
            "In Gallery": ArtworkStatus.IN_GALLERY,
            "On Exhibition": ArtworkStatus.ON_EXHIBITION,
            "In Storage": ArtworkStatus.IN_STORAGE,
        }
        exhibition_status_map = {
            "Past": ExhibitionStatus.PAST,
            "Current": ExhibitionStatus.CURRENT,
            "Upcoming": ExhibitionStatus.UPCOMING,
        }
        inquiry_status_map = {
            "New": InquiryStatus.NEW,
            "Read": InquiryStatus.READ,
            "Responded": InquiryStatus.RESPONDED,
        }

        for row in db.query(Artwork).all():
            s = row.status.value if hasattr(row.status, "value") else row.status
            if s in artwork_status_map:
                row.status = artwork_status_map[s]
                n += 1
            if row.medium in MEDIUM_MAP:
                row.medium = MEDIUM_MAP[row.medium]
                n += 1

        for row in db.query(Exhibition).all():
            s = row.status.value if hasattr(row.status, "value") else row.status
            if s in exhibition_status_map:
                row.status = exhibition_status_map[s]
                n += 1

        for row in db.query(Inquiry).all():
            s = row.status.value if hasattr(row.status, "value") else row.status
            if s in inquiry_status_map:
                row.status = inquiry_status_map[s]
                n += 1

        for sid, fields in ARTISTS_BY_ID.items():
            artist = db.get(Artist, UUID(sid))
            if not artist:
                continue
            artist.full_name = fields["full_name"]
            artist.biography = fields["biography"]
            n += 1

        for wid, fields in ARTWORKS_BY_ID.items():
            artwork = db.get(Artwork, UUID(wid))
            if not artwork:
                continue
            artwork.title = fields["title"]
            artwork.description = fields.get("description")
            if fields.get("creation_story"):
                artwork.creation_story = fields["creation_story"]
            n += 1

        for eid, fields in EXHIBITIONS_BY_ID.items():
            ex = db.get(Exhibition, UUID(eid))
            if not ex:
                continue
            ex.title = fields["title"]
            ex.description = fields["description"]
            n += 1

        db.commit()
        print(f"Локализация БД: обновлено записей — {n}")
    finally:
        db.close()


if __name__ == "__main__":
    localize()
