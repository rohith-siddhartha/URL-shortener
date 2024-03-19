Url Shortener - WATO assignment

I've deployed the service @ https://wato-assignment.onrender.com

Approach Explaination

  User Authentication and Authorization
  -> I've used username & password for authentication and jwt for authorization and handled resource permissions in the service layer for now
  
  Data Model
  -> I've used a PostgresSQL database to keep the data consistent and based on the data that I am fetching across all the API's, there wasn't much need for Table JOINS. So with these two fatcors I've choosen to stick to a relational DB instead of NoSQL. But I have not explored the analytics part of the project. That might affect my descision if get deeper into that. But for this assignment I've used PostgresSQL

  -> I've modelled three entities
    USER (username (primary key), password, urls (one to many))
    URL (id, fullUrl, shortUrl, expiresOn, clicks, user)
    CLICK (id, referralSource, browser, device, timestamp, url)
    
    So I am storing click along with these properties for analytis.

  URL shortening logic
  -> I am generating a randomKey and mapping it to the fullUrl.
  -> For each server instance, I'll use a unique key (server_id)
  -> Now for every request I am generating the key as (server_id + current_timestamp);
  -> Having the server_id will let me easily scale the system horizontally. This will make sure that at any given time no two server generate the same random key for a url.
  -> Collisions with in a server might occur very rarely (since the timestamp varies in milliseconds) and even in the case of collision I have a unique constraint on shortUrl which will make sure that request fails

  Caching
  -> I've used redis to cache the fullurl and also other responses wherever possible and the project has a lot of scope of improvement in caching which I can do but I've igonred it for now

  Deleting the URLs
  -> I've written a cron job that runs everyday at 00:00:00 AM to delete al the expired urls

  Analytics
  -> I haven't gone deep into this part as I felt that requirements for this part were not clear

  Database
  -> For the requirements given I felt that NoSQL would be good enough to scale the system. One more reason is that since we are deleting urls frequently I felt that storgae would suffice and a need for partitioning wouldn't arise so I haven't choosen NoSQL for now. But with more requirements I can think more on this part

  So this is about my solution. Thanks for the opportunity

