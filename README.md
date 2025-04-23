# Simple Payment Methods App

This is a simple app for managing payment methods. It allows user to add, view, activate, and delete payment methods. The app is designed as part of a case interview project.

## Features

- **Add Payment Methods**: User can add new payment methods with card details, expiry date, and CVV.
- **View Payment Methods**: Displays a list of all saved payment methods.
- **Activate Payment Methods**: User can set a payment method as active. This will deactivate any other activated payment method.
- **Delete Payment Methods**: User can delete payment methods.

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: CSS Modules for scoped and maintainable styles.
- **Build Tool**: Vite for fast development and optimised builds.
- **Validation**: npm `card-validator` library for card details validation
- **API**: Mock API integration for operations

## Project Structure

```
simpleProfileApp/
├── src/
│   ├── api/                # API functions for backend communication
│   ├── components/         # React components
│   │   ├── newPaymentMethodForm/  # Form / button for adding new payment methods
│   │   ├── paymentMethodItem/     # Individual payment method display (each card)
│   │   ├── paymentMethods/        # Payment methods list and handling of deletion/activation
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
```


## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Runarannem/simpleProfileApp.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   VITE_API_BASE_URL=<your-api-base-url>
   ```

### Running the App

1. Start the development server:
   ```sh
   npm run dev
   ```

2. Open the app in your browser at [http://localhost:5173](http://localhost:5173).

## Future Improvements

- Connecting this page to an actual website
- Add user authentication for secure access.
- Enhance responsive design.
- Implement better error handling for API requests.

Specific features I would have implemented if I had more time:
- Should have functionality to ensure at least one card is activated at all times, for example set the last added card as activated instead (if this makes sense for the use).
- Loading indicators to make it easier for the user to follow what happens when, also hindering clicking more than needed and calling the api unnecessary.
- More accurate/specific validations as well as feedback for the validations.
- More effective type handling, such as id possibly being undefined.
- Small stuff such as the user not having to write "/" for expiry date.
- Take "currency" into consideration (or remove from API), now this is by default NOK. Also it would make sense to add "Card Holder".
- Look more into credit card validation.
- Consider using react-hook-form or something like it instead of manually handling validations, errors and so, as it would simplify my code. No clue why I did not do this is the first place.
