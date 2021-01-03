# Šimtadienis

2021 metų Licėjaus šimtadienio sistema

To run this system:
1. Clone or download this repository
2. Install Node JS https://nodejs.org/en/download/
3. Install MySQL server https://dev.mysql.com/downloads/mysql/ (when setup prompts you to choose the setup type, choose Developer Default option)
4. Open CMD (command prompt) and navigate to the location of the MySQLd server which is probably C:\mysql\bin. Then to run the server type `mysqld.exe --console`
5. Set root password by typing `mysqladmin -u root password "new_password";` in the CMD.
6. Navigate to the folder this repository has been cloned or downloaded and configure the database by typing `mysql -u root -p < bankas-db-structure.sql`
7. In the folder you navigated to, rename `.env.example` file to just`.env`
8. Run the `npm install` command, to install all the dependencies for this project.
9. And start the system by typing `npm start`. Finnaly open http://localhost:3000 and enjoy.
