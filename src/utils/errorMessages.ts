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
  MEDICATION: {
    INVALID_ARGUMENTS: {
      ID: "ID is required and must be a valid ObjectID.",
      FORM_OF_MEDICATION:
        "Form of Medication is required and must be a non-empty string that has a length less than 6.",
      MEDICATION_ID:
        "MedicationID is required and must be a non-empty string that has a length less than 6.",
      REPEAT_INTERVAL:
        "Repeat Interval is required and must be a positive non-zero number.",
      REPEAT_UNIT: "RepeatUnit is required and must be a non-empty string.",
      REPEAT_ON: "RepeatOn is required and must be a non-empty array.",
      REPEAT_MONTHLY_ON_DAY:
        "RepeatMonthlyOnDay is required and must be positive.",
      NOTIFICATION_FREQUENCY:
        "NotificationFrequency is required and must be a non-empty string.",
      DOSES_PER_DAY: "DosesPerDay is required and must be a non-empty string.",
      DOSE_INTERVAL_IN_HOURS:
        "DoseIntervalInHours is required and must be a non-empty string.",
      DOSE_TIMES: "DoseTimes is required and must be a non-empty string.",
      USER_ID: "UserID is requried and must be a valid ObjectID.",
    },
    NOT_FOUND: "Medication does not exist.",
    CONFLICT: "Medication already exists",
    FAILURE: {
      DELETE: "Failed to delete medication.",
      UPDATE: "Failed to update medication.",
    },
  },
  SETTINGS: {
    INVALID_ARGUMENTS: {
      UserID: "UserID is required and must be a valid ObjectID.",
    },
    NOT_FOUND: "Settings do not exist for this user",
    CONFLICT: "Settings already exists for this user.",
    FAILURE: {
      CREATE: "Failed to create user settings.",
      UPDATE: "Failed to update user settings.",
    },
  },
  FORGOTPASSWORDCODE: {
    INVALID_ARGUMENTS: {
      USER_ID: "UserID is required and must be a valid ObjectID.",
      CODE: "Code is required.",
      NEW_PASSWORD: "New password is required.",
      CONFIRM_PASSWORD: "Confirm password is required.",
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
});

export default ERRORS;
