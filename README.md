# Flickr Speech Search
* This is an application that will listen to your voice and search Flickr for pictures relevant to your speech query.

### To start the app, navigate to this directory, run the following commands in console:
** "bundle install"
** "be shotgun"

(The Sinatra Skeleton was used here so we could use the local machine as a server.  Using HTML and JavaScript files without a server resulted in certain speech recognition methods being blocked by Chrome.)


# Usage:
To use the app, click the "Listen!" button, and speak your query.  The search will only be initated if the Web Speech API has a confidence rating of at least 0.65 to avoid mistakes.  Once initiated, the search will bring up 25 relevant posts from Flickr, which can be clicked on and viewed in another tab. Keep speaking to search with new queries.  Click the "End" button to end voice recognition.  Voice recognition will also end after 10 seconds of inactivity.  Click the "Listen!" button to start again.
