<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href='https://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
        <link href="css/style.css" rel="stylesheet" />
    </head>

    <body>
        <div class="container__gui">
            <div id="consoleWindow" class="console--window consoleWindow"></div>
            <div class="container__map">
                <h3>Map</h3>
                <div class="map"></div>
                <div class="console--info-panel">
                    <span class="info info--loc"></span>
                    <span class="info info--hp"></span>
                    <span class="info info--act"></span>
                    <span class="info info--enemy-hp"></span>
                </div>
            </div>
        </div>

        <div class="console--container__input">
            <input type="text" id="consoleInput" class="console--input consoleInput" />
            <div class="button button__submit buttonSubmit">Submit</div>
        </div>


        <script src="js/jquery-2.2.3.min.js"></script>
        <script src="js/game.js"></script>
    </body>
</html>
