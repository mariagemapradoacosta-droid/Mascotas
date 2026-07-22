# Security Spec for PetMind Firebase Firestore

## Data Invariants
1. All user data (pets, training plans, bookings, notifications) is organized under `/users/{userId}/...` subcollections.
2. A user can only read and write their own documents under `/users/{userId}` where `userId == request.auth.uid`.
3. Document fields for owner verification (`ownerId`, `userId`, `uid`) must match `request.auth.uid`.
4. Document IDs must be valid alphanumeric strings of reasonable length (`isValidId()`).

## Dirty Dozen Security Payloads
1. Unauthenticated write to `/users/user123/pets/pet1` -> PERMISSION_DENIED
2. Authenticated user `user_A` attempting to read `/users/user_B/pets/pet2` -> PERMISSION_DENIED
3. Authenticated user `user_A` attempting to create `/users/user_B/pets/pet3` -> PERMISSION_DENIED
4. Authenticated user `user_A` attempting to modify `/users/user_B/bookings/b1` -> PERMISSION_DENIED
5. User `user_A` injecting 100KB string into document ID `/users/user_A/pets/{huge_id}` -> PERMISSION_DENIED
6. User `user_A` injecting extra unapproved top-level fields during update (Shadow Update) -> PERMISSION_DENIED
7. User `user_A` setting `ownerId` to `user_B` -> PERMISSION_DENIED
8. Unauthenticated query listing `/users` -> PERMISSION_DENIED
9. Authenticated user `user_A` attempting to update `createdAt` field on an existing pet -> PERMISSION_DENIED
10. Unverified email user attempting to write data when email verification is enforced -> PERMISSION_DENIED
11. User `user_A` attempting to list another user's notifications -> PERMISSION_DENIED
12. User `user_A` passing an oversized string in `notes` or `summary` violating length limits -> PERMISSION_DENIED
