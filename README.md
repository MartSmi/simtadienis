# Šimtadienis

2021 metų Licėjaus šimtadienio sistema

To run this system:
1. Clone or download this repository
2. Install MySQL server https://dev.mysql.com/downloads/mysql/
3. Open CMD (command prompt) and navigate to the location of the MySQLd server which is probably C:\mysql\bin. Then to run the server type `mysqld.exe --console`
4. Set root password by typing `mysqladmin -u root password "new_password";` in the CMD.
5. Navigate to the folder this repository has been cloned or downloaded and configure the database by typing `mysql -u root -p < bankas-db-structure.sql`
6. Install Node JS https://nodejs.org/en/download/
7. In the folder you navigated to, rename `.env.example` file to just`.env`
8. And in that folder run the system by typing `npm start`. Finnaly open http://localhost:3000 and enjoy.
