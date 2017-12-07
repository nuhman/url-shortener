# url-shortener
## a microservice that takes long URLs and squeezes them into fewer characters to make a link that is easier to share  
  
URL Shortener Microservice built for freecodecamp API Project  

Live: https://nanos.herokuapp.com
  
**Promises:**  

 * You can pass a URL as a parameter and you will receive a shortened URL in the JSON response.
 * When anyone visit that shortened URL, it will get redirected to the original link.

**Examples for creating nano URLs:**
  
 * `https://nanos.herokuapp.com/new/https://reddit.com`
 * `https://nanos.herokuapp.com/new/https://www.freecodecamp.org/challenges/url-shortener-microservice`

**Example output:**  
  
 * `{ "original_url":"https://reddit.com", "short_url":"https://nanos.herokuapp.com/2aEU22" }`
  
Now if you visit `https://nanos.herokuapp.com/2aEU22`, you will be redirected to `https://reddit.com`
