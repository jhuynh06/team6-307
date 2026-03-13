# UML Class Diagrams

**Last updated:** Feb 23, 2026

---

## Data Model Diagram

![UML Class Diagram](../images_for_README/UMLDiagram.png)

---

## Key Models

### User
- `username` — unique string
- `hashedPassword` — bcrypt hash
- `fullName`, `pronouns`, `schoolYear`, `major`, `bio` — profile fields
- `isAdmin` — boolean, grants access to admin panel

### Store
- `name`, `hours`, `isOpen` — basic info
- `rating`, `reviewCount` — aggregate review data
- `bannerImage`, `cardImage`, `profileImage` — Azure Blob URLs
- `products` — embedded array of Product subdocuments

### Product (embedded in Store)
- `name`, `category`, `inStock`, `description`
- `tags` — array of strings
- `image` — Azure Blob URL
- `reviews` — embedded array of Review subdocuments

### Review (embedded in Product)
- `user`, `text`, `rating`, `date`
