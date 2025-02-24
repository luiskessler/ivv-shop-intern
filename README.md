## SETUP

1. Datenbank aufsetzen (UNTEN) AWS RDS Instanz
2. Environment Variabeln in .env setzen (AWS)
3. Admin User erstellen /signup - dann in der Datenbank role = "ADMIN" setzen


# **Schritt 1: AWS RDS Instanz erstellen**

1. Gehe zur **AWS RDS Konsole**.
2. Klicke auf **"Datenbank erstellen"**.
3. Wähle dein **Datenbanksystem** (z. B. PostgreSQL oder MySQL). (am besten einfach MySQL)
4. Konfiguriere Benutzername, Passwort und Instanzgröße.
5. Endpoint URL in .env kopieren

---

# **Schritt 2: Prisma Konfiguration anpassen**

Öffne deine `schema.prisma` Datei und ändere die Datenbankverbindung:

```prisma
datasource db {
  provider = "postgresql" // Falls nötig Änderung zu mysql (was auch immer in AWS RDS konfiguriert ist)
  url      = env("DATABASE_URL") // aus .env
}
```

Setze die neue `DATABASE_URL` in der `.env` Datei: (aus den AWS Werten)

```
DATABASE_URL="postgresql://<username>:<password>@<your-rds-endpoint>:5432/<db-name>?schema=public"
```
---

# **Schritt 4: Schema auf AWS RDS deployen**

```bash
npx prisma db push
```

---

# **Schritt 5: Verbindung testen & Prisma Studio nutzen**

Starte Prisma Studio, um die Datenbank in AWS RDS visuell zu prüfen:

```bash
npx prisma studio
```

-----------------------------------------------------------------------------------------------------------------------

## SETUP - 2

