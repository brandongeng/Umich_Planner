# Umich Planner

This app is a general purpose planner for Umich students. The app allows for students to view weather using the open weather API, add classes and see how long it takes to get to said class using google maps API and Firebase realtime databases. There is also a todo list maker. Everything can be saved using Google authentication and Firebase.

#### npm run start:backend

starts backend at port 8000

#### npm run start:frontend

starts frontend at port 3000.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### Technologies Used

<ul>
    <li>Frontend</li>
	<ul>
		<li>React</li>
		<li>HTML</li>
		<li>CSS (styled components)</li>
		<li>Javascript</li>
	</ul>
    <li>Backend</li>
    <ul>
		<li>Node</li>
		<li>Express</li>
		<li>Axios</li>
	</ul>
    <li>APIs</li>
	<ul>
		<li>Open Weather API</li>
        <li>Google Maps API - Directions</li>
        <li>Google Maps API - Geocoding</li>
	</ul>
</ul>

### TODOS

~~Store API keys safely and have all API calls occur in the backend~~ (8/20/2022 Note: Github ready)<br />
Split into components and put functions in their own js file for easier readability<br />
~~Add clean up function for duration use effect to avoid loops (!!)~~ ~~(8/24/2022 Note: not the issue, login function runs??)~~ (8/27 Solved with pause for loading)
