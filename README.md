# GreenEcovents Back End

View the live site [here](https://green-ecovents.vercel.app). <br>
View the API documentation [here](https://documenter.getpostman.com/view/22433617/2s9YeEdCwV).

Welcome to the GreenEcovents Back End repository! This is the solo-developed server-side implementation of the GreenEcovents project, an event management web application.

## Overview

GreenEcovents features a robust back end meticulously developed by a solo developer using TypeScript, Node.js, Express.js, and a PostgreSQL database. This back end supports user authentication, event management, content administration, and more.

## What I Did

As the sole developer, I spearheaded the entire back-end development of GreenEcovents. My responsibilities encompassed user management, event handling, and dynamic content management. Specifically, my contributions include:

## Features

- Authentication
  - User can register for an account
  - User can log in to an existing account
  - User can log out of an existing account
- User
  - User can view their profile
  - User can update their profile
  - Admin can view all users
  - Admin can update a user's role
  - Admin can delete a user
- Admin
  - Super admin can view all admins
  - Super admin can create an admin
  - Super admin can update an admin
  - Super admin can delete an admin
  - Admin can add new user
  - Admin can update user role
  - Admin can delete user
- Category
  - User can view all categories
  - User can view a single category
  - Admin can create a category
  - Admin can update a category
  - Admin can delete a category
- Event
  - User can view all events
  - User can view a single event
  - Admin can create an event
  - Admin can update an event
  - Admin can delete an event
- Booking
  - User can book an event
  - User can view all bookings
  - User can view a single booking
  - User can cancel a booking
  - Admin can view all bookings
  - Admin can view a single booking
  - Admin can update a booking
  - Admin can delete a booking
  - User can pay for a booking
  - User can download a booking receipt
- Review
  - User can view all reviews
  - User can provide a review for a booked event
  - Admin can view all reviews
  - Admin can view a single review
  - Admin can delete a review
- Feedback
  - User can provide feedback
  - Admin can view all feedbacks
  - Admin can view a single feedback
  - Admin can delete a feedback
- Content
  - Blog
    - User can view all blog posts
    - User can view a single blog post
    - Admin can create a blog post
    - Admin can update a blog post
    - Admin can delete a blog post
  - FAQ
    - User can view all FAQs
    - Admin can create a FAQ
    - Admin can update a FAQ
    - Admin can delete a FAQ
- Page
  - User can view all pages
  - User can view a single page
  - Admin can create a page
  - Admin can update a page
  - Admin can delete a page
- Subscriber
  - User can subscribe to newsletter
  - Admin can view all subscribers
  - Admin can view a single subscriber
  - Admin can delete a subscriber
- Mail
  - After booking, user will receive a mail
  - On booking status change, user will receive a mail
  - Admin can send mail to all subscribers
  - Admin can send mail to a single subscriber
  - User can send mail to admin for any query

## Technologies Used

- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Prisma
- Zod
- JWT

## Getting Started

1. Clone this repository:

```bash
git clone https://github.com/suhag-alamin/green-ecovents-server
```

2. Navigate to the project directory:

```bash
cd green-ecovents-server
```

3. Install dependencies:

```bash
yarn install
```

4. Configure your database settings in the `.env` file
5. Run database migrations:

```bash
yarn prisma migrate dev
```

6. Start the server:

```bash
yarn dev
```

## Configuration

Make sure to configure the necessary environment variables in a `.env` file based on the provided `.env.example`.

## Contributing

As the sole developer behind this project, contributions are not currently accepted. However, feel free to open issues for bug reports or feature requests.

Happy coding!
