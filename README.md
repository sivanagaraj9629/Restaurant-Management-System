# Restaurant Management System
This personal project is a web application developed using Angular for the front-end, Spring framework for the back-end, Hibernate and utilizes MySQL as the database management system.
It demonstrates various features such as user authentication, user roles (admin and user), CRUD operations on categories and items, order management and bill generation.

## Technologies Used

- Angular
- Spring
- Hibernate
- MySQL

## Key features

- User authentication: users can sign up, log in using their email and password (when one of the admins changes their status to true), and log out.
- Security features: JSON Web Tokens are used for secure authentication and authorization.
- User roles: the system supports both admin and user roles, each with different levels of access to functionalities available through their dashboards.
- Category and item management: admins can add, edit, and delete categories and items on their respective pages, which display a list of them. This is done by interacting with the buttons provided.
A filter functionality is also implemented, allowing admins to filter the categories or items list based on the words they type.
- User management: admins can approve or disable user accounts by changing their status, with notification emails sent to the user and all admins.
The users page contains a list of all users, a toggle button to change their status, and a filter functionality to refine the list.
- Order management: users can place orders by selecting items, specifying quantities and providing payment details.
- Bill generation: upon order submission, bills are automatically generated in PDF format, containing details of the order, saved in the database, and downloaded on the user's pc.
- Viewing and managing bills: Admins can view a list of all users' bills, delete any, or open the PDF of a specific one.
Users can view a list of their previously generated bills and access the PDF of any particular one.
- Change and reset password functionality: Users can update their passwords or reset them if forgotten.
In the case of a password reset, an email will be sent containing a link which will expire based on the reset token's expiration time.