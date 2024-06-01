@echo off

REM Get the filename argument (assuming it's the first argument after the script name)
set filename=%1

REM Check if filename is provided
if "%filename%" EQU "" (
  echo Error: Please provide a filename as an argument.
  exit /b 1
)

REM Replace spaces with hyphens in the filename (optional)
set escaped_filename=%filename:.="-"%

REM Construct the full command with dynamic filename
set full_command=npx typeorm migration:create src/database/migrations/%escaped_filename%"

REM Execute the full command
call %full_command%