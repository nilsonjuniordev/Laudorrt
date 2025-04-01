@echo off
set PGPASSWORD=Be111290@#
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d laudorrt -f backend/database.sql
pause 