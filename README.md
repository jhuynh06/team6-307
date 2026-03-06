## Product Vision
For Cal Poly students who utilize on-campus dining, Poly Rate My Food is a specialized rating platform that elevates the student dining experience and identifies the best campus dishes.

**Our product focuses on:**

- **Elevating Quality:** Providing honest, transparent data on popular dishes to help students avoid wasting money.

- **Data-Driven Choices:** Helping both students and faculty make informed decisions about food selection and menu planning for the week.

- **Bridging the Gap:** Creating a feedback loop where student discontent is transformed into actionable data for faculty to better allocate resources and improve options.

## Features

- User authentication (signup/login)
- Dish rating (1–5 stars)
- Written reviews
- Trending dishes dashboard
- Search/filter food options

**Core Values:**

- **Transparency:** Providing a clear "Quality vs. Cost" metric so students know exactly what they are getting for their dining dollars.

- **Efficiency for Faculty:** Offering a "free data collection" method that replaces manual surveys with real-time student sentiment.

- **Community Recommendation:** Reducing the "overwhelming" feeling for students and the "lack of options" feeling for seniors by highlighting the best dishes across all spread-out dining halls.

## UI Prototype
![](images_for_README/UMLDiagram.png)

## Architecture Docs

**Our Stack**

**Frontend** : React, Mantine

**Backend** : Express, Mongoose 

**Database** : MongoDB

## Development Environment Setup

We adopted Prettier and ESLint in order to have a cohesive coding style and linting rules. This helped us save time and limit merge conflicts.

## Class (Data Model) Diagrams


## Signup Sequence Diagram

![](security-diagram/user-signup-flow.png)

## Signin Sequence Diagram

![](security-diagram/user-signin-flow.png)

## Endpoint Sequence Diagram

![](security-diagram/endpoint-flow.png)