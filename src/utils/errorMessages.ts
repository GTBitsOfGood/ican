const ERRORS = Object.freeze({
  USER: {
    INVALID_ARGUMENTS: {
      EMAIL: "Email is required and must be a valid email.",
      PASSWORD:
        "Password must contain at least 6 characters, 1 number, and 1 symbol.",
      NAME: "Name is required and must be a non-empty string.",
    },
    NOT_FOUND: "User does not exist.",
    CONFLICT: {
      USER: "User already exists.",
      PASSWORD: "Password and Confirm Password must be equal.",
      PROVIDER: {
        GOOGLE: "User is signed in with google.",
        PASSWORD: "User is signed in with email and password.",
      },
    },
    UNAUTHORIZED: {
      PASSWORD:
        "Wrong password. Try again or click Forgot Password to reset it.",
    },
    FAILURE: {
      PASSWORD_UPDATE: "User password update failed.",
      DELETE_USER: "User deletion failed.",
    },
  },
  PET: {
    INVALID_ARGUMENTS: {
      USER_ID: "UserID is required and must be a valid ObjectID.",
      NAME: "Name is required and must be a non-empty string",
      PET_TYPE: "PetType is required and must conform to the PetType enum.",
    },
    NOT_FOUND: "Pet does not exist.",
    CONFLICT: "User already has a pet.",
    UNAUTHORIZED: "User is not permitted to modify another user's pet",
    FAILURE: {
      DELETE: "Failed to delete pet.",
      UPDATE: "Failed to update pet.",
    },
  },
  BAG: {
    FAILURE: {
      CREATE: "Failed to purchase item",
    },
  },
  MEDICATION: {
    INVALID_ARGUMENTS: {
      ID: "ID is required and must be a valid ObjectID.",
      FORM_OF_MEDICATION:
        "Form of Medication is required and must be a non-empty string that has a length less than 6.",
      MEDICATION_ID:
        "MedicationID is required and must be a non-empty string that has a length less than 6.",
      REPEAT_INTERVAL:
        "RepeatInterval is required and must be a positive non-zero number.",
      REPEAT_UNIT: "RepeatUnit is required and must be a non-empty string.",
      REPEAT_WEEKLY_ON: "RepeatOn is required and must be a non-empty array.",
      REPEAT_MONTHLY_ON_DAY: "RepeatMonthlyOnDay must be positive.",
      REPEAT_MONTHLY_ON_WEEK:
        "RepeatMonthlyOnWeek must be a number between 1-4.",
      DOSES_UNIT: "DosesUnit must be either 'doses' or 'hours'.",
      NOTIFICATION_FREQUENCY:
        "NotificationFrequency is required and must be either 'day of dose' or 'every dose'.",
      DOSES_PER_DAY: "DosesPerDay must be a positive nonzero number.",
      DOSE_INTERVAL_IN_HOURS: "DoseIntervalInHours must be a non-empty string.",
      DOSAGE_AMOUNT: "DosageAmount is required and must be a non-empty string",
      DOSE_TIMES: "DoseTimes is required and must be a non-empty array.",
      USER_ID: "UserID is requried and must be a valid ObjectID.",
    },
    NOT_FOUND: "Medication does not exist.",
    CONFLICT: "Medication already exists",
    FAILURE: {
      DELETE: "Failed to delete medication.",
      UPDATE: "Failed to update medication.",
    },
    UNAUTHORIZED: "User is not permitted to get another user's medication",
  },
  SETTINGS: {
    INVALID_ARGUMENTS: {
      UserID: "UserID is required and must be a valid ObjectID.",
      PIN: "New pin must be different from current pin.",
    },
    NOT_FOUND: "Settings do not exist for this user",
    CONFLICT: "Settings already exists for this user.",
    FAILURE: {
      CREATE: "Failed to create user settings.",
      UPDATE: "Failed to update user settings.",
    },
    UNAUTHORIZED:
      "User is not permitted to get or modify another user's settings",
  },
  FORGOTPASSWORDCODE: {
    INVALID_ARGUMENTS: {
      USER_ID: "UserID is required and must be a valid ObjectID.",
      CODE: "Code is required.",
      NEW_PASSWORD: "New password is required.",
      CONFIRM_PASSWORD: "Confirm password is required.",
    },
    ILLEGAL_ARGUMENTS: {
      PROVIDER:
        "Password cannot be changed for accounts using OAuth authentication.",
    },
    NOT_FOUND: "A forgot password code not found for this user.",
    CONFLICT: "Forgot password code has expired.",
    UNAUTHORIZED: {
      CODE: "The submitted code is incorrect.",
      PASSWORD: "Passwords do not match.",
    },
    FAILURE: {
      UPDATE: "Failed to update forgot password code.",
      DELETE: "Failed to delete forgot password code.",
    },
  },
  MAIL: {
    FAILURE: "Failed to send email.",
  },
  JWT: {
    UNAUTHORIZED: "Invalid or expired token.",
  },
  TOKEN: {
    UNAUTHORIZED: "Authentication token is missing or malformed",
  },
});

export default ERRORS;
