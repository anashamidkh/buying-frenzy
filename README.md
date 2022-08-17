## Description
Backend service and a database for a food delivery platform

## Technology Stack
- Node.js
- NestJS
- Javascript
- Typescript
- TypeORM
- PostgreSQL
- Docker
- Swagger

## How to setup?

```bash
$ git clone {{REPOSITORY-URL}}
$ npm install
$ docker compose up -d
$ npm run typeorm:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```
## Important Commands

```bash
# Command to run migrations. Migrations will create database schema and seed data.
npm run typeorm:run

# Command to revert migration. This will revert last executed migration.
npm run typeorm:revert
```

## APIs
1. List all restaurants / List all restaurants that are open at a certain datetime:
   
   **Description:** The API returns restaurants on basis of optional parameters. Pagination is supported by default. In case, if limit & offset parameters are not passed in request, then 20 and 0 get sets automatically.
   
   **URL:** ```{{URL}}/restaurants?dateTime=2022-08-15 14:32:00&limit=3&offset=0```
   
   **HTTP Method:** ```GET```
   
   **Query Parameters:**
   ```
   dateTime     //Optional - e.g: 2022-08-15 14:32:00
   limit        //Optional - e.g: 3
   offset       //Optional - e.g: 0
   ```
   
   **Sample Response:**
   ```json
   {
    "totalRecords": 866,
    "restaurants": [
        {
            "name": "'Ulu Ocean Grill and Sushi Lounge",
            "cashBalance": 4483.84,
            "operationalSchedule": [
                {
                    "day": "mon",
                    "openAt": "14:30:00",
                    "closeAt": "20:00:00"
                }
            ]
        },
        {
            "name": "024 Grille",
            "cashBalance": 4882.81,
            "operationalSchedule": [
                {
                    "day": "mon",
                    "openAt": "11:45:00",
                    "closeAt": "16:45:00"
                }
            ]
        },
        {
            "name": "100% de Agave",
            "cashBalance": 4629.91,
            "operationalSchedule": [
                {
                    "day": "mon",
                    "openAt": "05:30:00",
                    "closeAt": "18:00:00"
                }
            ]
        }
      ]
    }
   ```
2. List top y restaurants that have more or less than x number of dishes within a price range, ranked alphabetically. More or less (than x) is a parameter that the API allows the consumer to enter:
   
   **Description:** The API will return restaurants names on basis of provided parameters. In case, if both greaterThan and lessThan is passed in request, then priority will be given to greaterThan automatically. If both are not provided in request then error will be thrown.
   
   **URL:** ```{{URL}}/restaurants/top?limit=3&greaterThan=1&lessThan=3&minPrice=10.15&maxPrice=15```
   
   **HTTP Method:** ```GET```
   
   **Query Parameters:**
   ```
   limit                //Mandatory - Will return top Y restaurants on basis of it. e.g: 3
   greaterThan          //Optional - This will be used for more than x number of dishes. e.g: 1
   lessThan             //Optional - This will be used for less than x number of dishes. e.g: 3
   minPrice             //Mandatory - This will be used for starting price range
   maxPrice             //Mandatory - This will be used for ending price range
   ```
   
   **Sample Response:**
   ```json
   [
    {
        "name": "024 Grille"
    },
    {
        "name": "100% de Agave"
    },
    {
        "name": "100% Mexicano Restaurant"
    }
   ]
   ```
3. Search for restaurants, ranked by relevance to search term:
   
   **Description:** The API returns restaurants on basis of relevant name. Pagination is supported by default. In case, if limit & offset parameters are not passed in request, then 20 and 0 get sets automatically.
   
   **URL:** ```{{URL}}/restaurants?name=mexican```
   
   **HTTP Method:** ```GET```
   
   **Query Parameters:**
   ```
   name           //Optional - e.g: mexican
   ```
   
   **Sample Response:**
   ```json
   {
    "totalRecords": 8,
    "restaurants": [
        {
            "name": "Agaves Mexican Grill",
            "cashBalance": 4766.88,
            "operationalSchedule": [
                {
                    "day": "mon",
                    "openAt": "07:15:00",
                    "closeAt": "00:15:00"
                },
                {
                    "day": "tues",
                    "openAt": "15:00:00",
                    "closeAt": "03:00:00"
                },
                ......
                {
                    "day": "sat",
                    "openAt": "10:45:00",
                    "closeAt": "23:00:00"
                }
            ]
        },
        {
            "name": "Chayo Mexican Kitchen + Tequila Bar",
            "cashBalance": 3432.97,
            "operationalSchedule": [
                {
                    "day": "mon",
                    "openAt": "07:15:00",
                    "closeAt": "10:00:00"
                },
                ......
                {
                    "day": "sun",
                    "openAt": "12:00:00",
                    "closeAt": "01:15:00"
                }
            ]
        }
        ......
    ]
   }
   ```
4. Process a user purchasing a dish from a restaurant, handling all relevant data changes in an atomic transaction. Do watch out for potential race conditions that can arise from concurrent transactions:
   
   **Description:** The API creates order. After validating payload, the API creates order, debits the cash balance of user and credits the cash balance of restaurant. Database transactions are atomic, and if any error occurs during process no records would be inserted in database.
   
   **URL:** ```{{URL}}/order```
   
   **HTTP Method:** ```POST```
   
   **Body:**
   ```
   {
      "userId": 1,
      "dishName": "Postum cereal coffee",
      "restaurantId": 1
   }
   ```
   
   **Sample Response:**
   ```json
   {
    "orderId": 9309,
    "restaurantName": "'Ulu Ocean Grill and Sushi Lounge",
    "dishName": "Postum cereal coffee",
    "amount": 13.88,
    "userName": "Edith Johnson"
   }
   ```
   
## Documentation
For API documentation, access swagger page:

```bash
http://localhost:3000/api/documentation
```