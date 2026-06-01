from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "sqlite:///./gallery.db"
    secret_key: str = "dev-secret-change-in-production"
    session_max_age: int = 86400
    debug: bool = True


settings = Settings()
