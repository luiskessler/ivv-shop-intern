
# **SETUP ANLEITUNG FÜR DEN ONLINE-SHOP**

## 1. **Datenbank aufsetzen (AWS RDS Instanz)**

### **Schritt 1: Erstellen einer Datenbank in AWS RDS**

1. Gehe zu **AWS RDS Konsole** (https://aws.amazon.com/rds/).
2. Klicke auf **"Datenbank erstellen"**.
3. Wähle **MySQL** als Datenbanksystem (wenn du unsicher bist, wähle MySQL).
4. Gib einen **Benutzernamen**, ein **Passwort** und eine **Instanzgröße** (z.B. db.t3.micro) ein.
5. Speichere die **Endpoint URL** (dies ist die URL, die den Zugriff auf die Datenbank ermöglicht) und füge sie später in die `.env` Datei deines Projekts ein.

### **Schritt 2: Die Datenbank-Verbindung einrichten**

1. Öffne die Datei `.env` in deinem Projekt.
2. Setze den **Datenbank-URL** so, dass er mit der von AWS bereitgestellten URL übereinstimmt:

   Beispiel für eine PostgreSQL-Datenbank:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@<your-rds-endpoint>:5432/<db-name>?schema=public"
   ```

   **Tipp:** Ersetze `<username>`, `<password>`, `<your-rds-endpoint>` und `<db-name>` mit den echten Werten, die du von AWS erhalten hast.

### **Schritt 3: Prisma konfigurieren**

1. In der Datei `schema.prisma` des Projekts, stelle sicher, dass die Datenbankverbindung korrekt ist:
   
   ```prisma
   datasource db {
     provider = "mysql" // Falls du MySQL benutzt. Andernfalls "postgresql".
     url      = env("DATABASE_URL") // Diese URL wird aus der .env Datei geladen.
   }
   ```

### **Schritt 4: Prisma auf AWS RDS anwenden**

1. Öffne die Konsole (Terminal) und führe diesen Befehl aus, um die Datenbankstruktur (Schema) auf die AWS-Datenbank zu übertragen:
   ```bash
   npx prisma db push
   ```

### **Schritt 5: Datenbank testen**

1. Starte **Prisma Studio** mit folgendem Befehl:
   ```bash
   npx prisma studio
   ```
   Mit Prisma Studio kannst du die Datenbank visuell überprüfen und sicherstellen, dass sie richtig eingerichtet ist.

---

## 2. **AWS S3 Bucket für Produktbilder einrichten**

### **Schritt 1: S3 Bucket erstellen**

1. Gehe zur **AWS S3 Konsole** (https://aws.amazon.com/s3/).
2. Klicke auf **"Bucket erstellen"**.
3. Gib dem Bucket den Namen **"product-images"** (dies wird für die Speicherung von Produktbildern genutzt).
4. Lass die restlichen Einstellungen auf den Standardwerten und klicke auf **"Erstellen"**.

### **Schritt 2: Zugriff auf den Bucket konfigurieren**

1. Nachdem der Bucket erstellt wurde, gehe zu den **"Berechtigungen"** und stelle sicher, dass der Bucket öffentlich lesbar ist (damit Bilder auf deiner Website angezeigt werden können).

### **Schritt 3: Environment Variablen für den Bucket hinzufügen**

1. In der `.env` Datei deines Projekts, füge die folgenden Variablen hinzu, damit dein Code auf den S3 Bucket zugreifen kann:

   ```env
   AWS_S3_BUCKET_NAME="product-images" // Name des S3 Buckets
   AWS_ACCESS_KEY_ID="<deine-access-key-id>" // Diese erhältst du in deinem AWS-Konto
   AWS_SECRET_ACCESS_KEY="<dein-secret-access-key>" // Diese erhältst du in deinem AWS-Konto
   AWS_REGION="<deine-region>" // Z.B. "us-west-2"
   ```

   **Wichtig:** Die **Access Key ID** und **Secret Access Key** erhältst du aus der AWS IAM Konsole. Diese sollten nicht öffentlich geteilt werden.

---

## 3. **Admin Benutzer erstellen (für die Shop-Verwaltung)**

### **Schritt 1: Admin Benutzer erstellen**

1. Um einen **Admin User** zu erstellen, kannst du dich über die **Signup-Funktion** im Shop anmelden.
2. **Rolle des Benutzers auf "ADMIN" gesetzt** (in der Datenbank) wird, sodass der Benutzer vollen Zugriff auf das Admin-Panel hat.

## 4. **Produkte in /admin einrichten**

1. Einfach /admin aufrufen und dann unter dem Reiter **"Produkte"** die **"Neues Produkt hinzufügen"** Schaltfläche drücken.
2. Einfach neues Produkt hinzufügen

---

## Zusammenfassung:

1. **Datenbank einrichten:** Erstelle eine AWS RDS Instanz (z.B. MySQL), konfiguriere die Verbindung und teste mit Prisma.
2. **S3 Bucket einrichten:** Erstelle einen S3 Bucket für Produktbilder, konfiguriere die Zugriffseinstellungen und richte die Environment Variablen ein.
3. **Admin Benutzer erstellen:** Admin-Konto erstellen, um den Online-Shop zu verwalten.
