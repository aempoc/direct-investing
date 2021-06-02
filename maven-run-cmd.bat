@ECHO OFF

:MENU
echo 1. Install Package in Author Instance
echo 2. Install Bundle in Author Instance
echo 3. Install Package in Publish Instance
echo 4. Install Bundle in Publish Instance
SET /P ch="Please select task:"
if "%ch%" == "1" GOTO :CASE_1
if "%ch%" == "2" GOTO :CASE_2
if "%ch%" == "3" GOTO :CASE_3
if "%ch%" == "4" GOTO :CASE_4
:CASE_1
echo Installing package to Author instance..
mvn clean install -PautoInstallPackage
GOTO :MENU
:CASE_2
echo Installing bundle to Author instance..
mvn clean install -PautoInstallBundle
GOTO :MENU
:CASE_3
echo Installing package to Publish instance..
mvn clean install -PautoInstallPackage -Daem.port=4503
GOTO :MENU
:CASE_4
echo Installing bundle to Publish instance..
mvn clean install -PautoInstallBundle -Daem.port=4503
GOTO :MENU
:CASE_5
GOTO :EXIT
:DEFAULT_CASE
echo Invalid choice
GOTO :MENU
pause
