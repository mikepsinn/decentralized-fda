/**
 * Decentralized FDA API
 * A platform for quantifying the effects of every drug, supplement, food, and other factor on your health.
 *
 * OpenAPI spec version: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Card } from "../models/Card"
import { TrackingReminderNotificationAction } from "../models/TrackingReminderNotificationAction"
import { TrackingReminderNotificationTrackAllAction } from "../models/TrackingReminderNotificationTrackAllAction"
import { Unit } from "../models/Unit"

export class TrackingReminderNotification {
  "actionArray": Array<TrackingReminderNotificationAction>
  "availableUnits": Array<Unit>
  /**
   * Link to study comparing variable with strongest relationship for user or population
   */
  "bestStudyLink"?: string
  "bestStudyCard"?: Card
  /**
   * Link to study comparing variable with strongest relationship for user
   */
  "bestUserStudyLink"?: string
  "bestUserStudyCard"?: Card
  /**
   * Link to study comparing variable with strongest relationship for population
   */
  "bestPopulationStudyLink"?: string
  "bestPopulationStudyCard"?: Card
  /**
   * Description of relationship with variable with strongest relationship for user or population
   */
  "optimalValueMessage"?: string
  /**
   * Description of relationship with variable with strongest relationship for population
   */
  "commonOptimalValueMessage"?: string
  /**
   * Description of relationship with variable with strongest relationship for user
   */
  "userOptimalValueMessage"?: string
  "card"?: Card
  /**
   * Your client id can be obtained by creating an app at https://builder.quantimo.do
   */
  "clientId"?: string
  /**
   * The way multiple measurements are aggregated over time
   */
  "combinationOperation"?: TrackingReminderNotificationCombinationOperationEnum
  /**
   * Ex: 2017-07-29 20:49:54 UTC ISO 8601 YYYY-MM-DDThh:mm:ss
   */
  "createdAt"?: string
  /**
   * Ex: Trader Joe's Bedtime Tea
   */
  "displayName"?: string
  /**
   * Is the user specified default value or falls back to the last value in user unit. Good for initializing input fields. Unit: User-specified or common.
   */
  "modifiedValue"?: number
  /**
   * Ex: /5
   */
  "unitAbbreviatedName"?: string
  /**
   * Ex: 5
   */
  "unitCategoryId"?: number
  /**
   * Ex: Rating
   */
  "unitCategoryName"?: string
  /**
   * Ex: 10
   */
  "unitId"?: number
  /**
   * Ex: 1 to 5 Rating
   */
  "unitName"?: string
  /**
   * Default value to use for the measurement when tracking
   */
  "defaultValue"?: number
  /**
   * Valence indicates what type of buttons should be used when recording measurements for this variable. positive - Face buttons with the happiest face equating to a 5/5 rating where higher is better like Overall Mood. negative - Face buttons with the happiest face equating to a 1/5 rating where lower is better like Headache Severity. numeric - Just 1 to 5 numeric buttons for neutral variables.
   */
  "description"?: string
  /**
   * True if the reminders should be delivered via email
   */
  "email"?: boolean
  /**
   * Ex: 0
   */
  "fillingValue": number
  /**
   * Ex: ion-sad-outline
   */
  "iconIcon"?: string
  /**
   * id for the specific PENDING tracking remidner
   */
  "id": number
  /**
   * Ex: https://rximage.nlm.nih.gov/image/images/gallery/original/55111-0129-60_RXNAVIMAGE10_B051D81E.jpg
   */
  "imageUrl"?: string
  /**
   * Ex: happiestFaceIsFive
   */
  "inputType"?: string
  /**
   * Ex: ion-happy-outline
   */
  "ionIcon"?: string
  /**
   * Ex: 3
   */
  "lastValue"?: number
  /**
   * True if this variable is normally tracked via manual user input rather than automatic imports
   */
  "manualTracking"?: boolean
  /**
   * Ex: 5
   */
  "maximumAllowedValue"?: number
  /**
   * Ex: 1
   */
  "minimumAllowedValue"?: number
  /**
   * Ex: 3
   */
  "mostCommonValue"?: number
  /**
   * True if the reminders should appear in the notification bar
   */
  "notificationBar"?: boolean
  /**
   * Ex: UTC ISO 8601 YYYY-MM-DDThh:mm:ss
   */
  "notifiedAt"?: string
  /**
   * Ex: 5
   */
  "numberOfUniqueValues"?: number
  /**
   * Indicates whether the variable is usually an outcome of interest such as a symptom or emotion
   */
  "outcome"?: boolean
  /**
   * Ex: img/variable_categories/emotions.png
   */
  "pngPath"?: string
  /**
   * Ex: https://safe.dfda.earth/img/variable_categories/emotions.png
   */
  "pngUrl"?: string
  /**
   * True if the reminders should appear as a popup notification
   */
  "popUp"?: boolean
  /**
   * Link to associated product for purchase
   */
  "productUrl"?: string
  /**
   * Ex: How is your overall mood?
   */
  "question"?: string
  /**
   * Ex: How is your overall mood on a scale of 1 to 5??
   */
  "longQuestion"?: string
  /**
   * Ex: 01-01-2018
   */
  "reminderEndTime"?: string
  /**
   * How often user should be reminded in seconds. Ex: 86400
   */
  "reminderFrequency"?: number
  /**
   * String identifier for the sound to accompany the reminder
   */
  "reminderSound"?: string
  /**
   * Earliest time of day at which reminders should appear in UTC HH:MM:SS format
   */
  "reminderStartTime"?: string
  /**
   * UTC ISO 8601 YYYY-MM-DDThh:mm:ss timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startAt if the track endpoint is used.
   */
  "reminderTime"?: string
  /**
   * Ex: 4
   */
  "secondMostCommonValue"?: number
  /**
   * Ex: 1
   */
  "secondToLastValue"?: number
  /**
   * True if the reminders should be delivered via SMS
   */
  "sms"?: boolean
  /**
   * Ex: https://safe.dfda.earth/img/variable_categories/emotions.svg
   */
  "svgUrl"?: string
  /**
   * Ex: 2
   */
  "thirdMostCommonValue"?: number
  /**
   * Ex: 2
   */
  "thirdToLastValue"?: number
  /**
   * Ex: Rate Overall Mood
   */
  "title"?: string
  /**
   * Ex: 3
   */
  "total"?: number
  "trackAllActions": Array<TrackingReminderNotificationTrackAllAction>
  /**
   * id for the repeating tracking remidner
   */
  "trackingReminderId"?: number
  /**
   * Ex: https://rximage.nlm.nih.gov/image/images/gallery/original/55111-0129-60_RXNAVIMAGE10_B051D81E.jpg
   */
  "trackingReminderImageUrl"?: string
  /**
   * Ex: 5072482
   */
  "trackingReminderNotificationId"?: number
  /**
   * UTC ISO 8601 YYYY-MM-DDThh:mm:ss timestamp for the specific time the variable should be tracked in UTC.  This will be used for the measurement startAt if the track endpoint is used.
   */
  "trackingReminderNotificationTime"?: string
  /**
   * Ex: 1501534124
   */
  "trackingReminderNotificationTimeEpoch"?: number
  /**
   * Ex: 15:48:44
   */
  "trackingReminderNotificationTimeLocal"?: string
  /**
   * Ex: 8PM Sun, May 1
   */
  "trackingReminderNotificationTimeLocalHumanString"?: string
  /**
   * When the record in the database was last updated. Use UTC ISO 8601 YYYY-MM-DDThh:mm:ss  datetime format. Time zone should be UTC and not local.
   */
  "updatedAt"?: string
  /**
   * ID of User
   */
  "userId"?: number
  /**
   * Ex: /5
   */
  "userVariableUnitAbbreviatedName"?: string
  /**
   * Ex: 5
   */
  "userVariableUnitCategoryId"?: number
  /**
   * Ex: Rating
   */
  "userVariableUnitCategoryName"?: string
  /**
   * Ex: 10
   */
  "userVariableUnitId"?: number
  /**
   * Ex: 1 to 5 Rating
   */
  "userVariableUnitName"?: string
  /**
   * Ex: 1
   */
  "userVariableVariableCategoryId"?: number
  /**
   * Ex: Emotions
   */
  "userVariableVariableCategoryName"?: string
  /**
   * Valence indicates what type of buttons should be used when recording measurements for this variable. positive - Face buttons with the happiest face equating to a 5/5 rating where higher is better like Overall Mood. negative - Face buttons with the happiest face equating to a 1/5 rating where lower is better like Headache Severity. numeric - Just 1 to 5 numeric buttons for neutral variables.
   */
  "valence"?: string
  /**
   * Ex: 1
   */
  "variableCategoryId"?: number
  /**
   * Ex: https://static.quantimo.do/img/variable_categories/theatre_mask-96.png
   */
  "variableCategoryImageUrl"?: string
  /**
   * Ex: Emotions, Treatments, Symptoms...
   */
  "variableCategoryName"?: TrackingReminderNotificationVariableCategoryNameEnum
  /**
   * Id for the variable to be tracked
   */
  "variableId"?: number
  /**
   * Ex: https://image.png
   */
  "variableImageUrl"?: string
  /**
   * Name of the variable to be used when sending measurements
   */
  "variableName"?: string

  static readonly discriminator: string | undefined = undefined

  static readonly attributeTypeMap: Array<{
    name: string
    baseName: string
    type: string
    format: string
  }> = [
    {
      name: "actionArray",
      baseName: "actionArray",
      type: "Array<TrackingReminderNotificationAction>",
      format: "",
    },
    {
      name: "availableUnits",
      baseName: "availableUnits",
      type: "Array<Unit>",
      format: "",
    },
    {
      name: "bestStudyLink",
      baseName: "bestStudyLink",
      type: "string",
      format: "",
    },
    {
      name: "bestStudyCard",
      baseName: "bestStudyCard",
      type: "Card",
      format: "",
    },
    {
      name: "bestUserStudyLink",
      baseName: "bestUserStudyLink",
      type: "string",
      format: "",
    },
    {
      name: "bestUserStudyCard",
      baseName: "bestUserStudyCard",
      type: "Card",
      format: "",
    },
    {
      name: "bestPopulationStudyLink",
      baseName: "bestPopulationStudyLink",
      type: "string",
      format: "",
    },
    {
      name: "bestPopulationStudyCard",
      baseName: "bestPopulationStudyCard",
      type: "Card",
      format: "",
    },
    {
      name: "optimalValueMessage",
      baseName: "optimalValueMessage",
      type: "string",
      format: "",
    },
    {
      name: "commonOptimalValueMessage",
      baseName: "commonOptimalValueMessage",
      type: "string",
      format: "",
    },
    {
      name: "userOptimalValueMessage",
      baseName: "userOptimalValueMessage",
      type: "string",
      format: "",
    },
    {
      name: "card",
      baseName: "card",
      type: "Card",
      format: "",
    },
    {
      name: "clientId",
      baseName: "clientId",
      type: "string",
      format: "",
    },
    {
      name: "combinationOperation",
      baseName: "combinationOperation",
      type: "TrackingReminderNotificationCombinationOperationEnum",
      format: "",
    },
    {
      name: "createdAt",
      baseName: "createdAt",
      type: "string",
      format: "",
    },
    {
      name: "displayName",
      baseName: "displayName",
      type: "string",
      format: "",
    },
    {
      name: "modifiedValue",
      baseName: "modifiedValue",
      type: "number",
      format: "double",
    },
    {
      name: "unitAbbreviatedName",
      baseName: "unitAbbreviatedName",
      type: "string",
      format: "",
    },
    {
      name: "unitCategoryId",
      baseName: "unitCategoryId",
      type: "number",
      format: "",
    },
    {
      name: "unitCategoryName",
      baseName: "unitCategoryName",
      type: "string",
      format: "",
    },
    {
      name: "unitId",
      baseName: "unitId",
      type: "number",
      format: "",
    },
    {
      name: "unitName",
      baseName: "unitName",
      type: "string",
      format: "",
    },
    {
      name: "defaultValue",
      baseName: "defaultValue",
      type: "number",
      format: "float",
    },
    {
      name: "description",
      baseName: "description",
      type: "string",
      format: "",
    },
    {
      name: "email",
      baseName: "email",
      type: "boolean",
      format: "",
    },
    {
      name: "fillingValue",
      baseName: "fillingValue",
      type: "number",
      format: "",
    },
    {
      name: "iconIcon",
      baseName: "iconIcon",
      type: "string",
      format: "",
    },
    {
      name: "id",
      baseName: "id",
      type: "number",
      format: "int32",
    },
    {
      name: "imageUrl",
      baseName: "imageUrl",
      type: "string",
      format: "",
    },
    {
      name: "inputType",
      baseName: "inputType",
      type: "string",
      format: "",
    },
    {
      name: "ionIcon",
      baseName: "ionIcon",
      type: "string",
      format: "",
    },
    {
      name: "lastValue",
      baseName: "lastValue",
      type: "number",
      format: "double",
    },
    {
      name: "manualTracking",
      baseName: "manualTracking",
      type: "boolean",
      format: "",
    },
    {
      name: "maximumAllowedValue",
      baseName: "maximumAllowedValue",
      type: "number",
      format: "",
    },
    {
      name: "minimumAllowedValue",
      baseName: "minimumAllowedValue",
      type: "number",
      format: "",
    },
    {
      name: "mostCommonValue",
      baseName: "mostCommonValue",
      type: "number",
      format: "double",
    },
    {
      name: "notificationBar",
      baseName: "notificationBar",
      type: "boolean",
      format: "",
    },
    {
      name: "notifiedAt",
      baseName: "notifiedAt",
      type: "string",
      format: "",
    },
    {
      name: "numberOfUniqueValues",
      baseName: "numberOfUniqueValues",
      type: "number",
      format: "",
    },
    {
      name: "outcome",
      baseName: "outcome",
      type: "boolean",
      format: "",
    },
    {
      name: "pngPath",
      baseName: "pngPath",
      type: "string",
      format: "",
    },
    {
      name: "pngUrl",
      baseName: "pngUrl",
      type: "string",
      format: "",
    },
    {
      name: "popUp",
      baseName: "popUp",
      type: "boolean",
      format: "",
    },
    {
      name: "productUrl",
      baseName: "productUrl",
      type: "string",
      format: "",
    },
    {
      name: "question",
      baseName: "question",
      type: "string",
      format: "",
    },
    {
      name: "longQuestion",
      baseName: "longQuestion",
      type: "string",
      format: "",
    },
    {
      name: "reminderEndTime",
      baseName: "reminderEndTime",
      type: "string",
      format: "",
    },
    {
      name: "reminderFrequency",
      baseName: "reminderFrequency",
      type: "number",
      format: "",
    },
    {
      name: "reminderSound",
      baseName: "reminderSound",
      type: "string",
      format: "",
    },
    {
      name: "reminderStartTime",
      baseName: "reminderStartTime",
      type: "string",
      format: "",
    },
    {
      name: "reminderTime",
      baseName: "reminderTime",
      type: "string",
      format: "",
    },
    {
      name: "secondMostCommonValue",
      baseName: "secondMostCommonValue",
      type: "number",
      format: "double",
    },
    {
      name: "secondToLastValue",
      baseName: "secondToLastValue",
      type: "number",
      format: "double",
    },
    {
      name: "sms",
      baseName: "sms",
      type: "boolean",
      format: "",
    },
    {
      name: "svgUrl",
      baseName: "svgUrl",
      type: "string",
      format: "",
    },
    {
      name: "thirdMostCommonValue",
      baseName: "thirdMostCommonValue",
      type: "number",
      format: "double",
    },
    {
      name: "thirdToLastValue",
      baseName: "thirdToLastValue",
      type: "number",
      format: "double",
    },
    {
      name: "title",
      baseName: "title",
      type: "string",
      format: "",
    },
    {
      name: "total",
      baseName: "total",
      type: "number",
      format: "double",
    },
    {
      name: "trackAllActions",
      baseName: "trackAllActions",
      type: "Array<TrackingReminderNotificationTrackAllAction>",
      format: "",
    },
    {
      name: "trackingReminderId",
      baseName: "trackingReminderId",
      type: "number",
      format: "int32",
    },
    {
      name: "trackingReminderImageUrl",
      baseName: "trackingReminderImageUrl",
      type: "string",
      format: "",
    },
    {
      name: "trackingReminderNotificationId",
      baseName: "trackingReminderNotificationId",
      type: "number",
      format: "",
    },
    {
      name: "trackingReminderNotificationTime",
      baseName: "trackingReminderNotificationTime",
      type: "string",
      format: "",
    },
    {
      name: "trackingReminderNotificationTimeEpoch",
      baseName: "trackingReminderNotificationTimeEpoch",
      type: "number",
      format: "",
    },
    {
      name: "trackingReminderNotificationTimeLocal",
      baseName: "trackingReminderNotificationTimeLocal",
      type: "string",
      format: "",
    },
    {
      name: "trackingReminderNotificationTimeLocalHumanString",
      baseName: "trackingReminderNotificationTimeLocalHumanString",
      type: "string",
      format: "",
    },
    {
      name: "updatedAt",
      baseName: "updatedAt",
      type: "string",
      format: "",
    },
    {
      name: "userId",
      baseName: "userId",
      type: "number",
      format: "int32",
    },
    {
      name: "userVariableUnitAbbreviatedName",
      baseName: "userVariableUnitAbbreviatedName",
      type: "string",
      format: "",
    },
    {
      name: "userVariableUnitCategoryId",
      baseName: "userVariableUnitCategoryId",
      type: "number",
      format: "",
    },
    {
      name: "userVariableUnitCategoryName",
      baseName: "userVariableUnitCategoryName",
      type: "string",
      format: "",
    },
    {
      name: "userVariableUnitId",
      baseName: "userVariableUnitId",
      type: "number",
      format: "",
    },
    {
      name: "userVariableUnitName",
      baseName: "userVariableUnitName",
      type: "string",
      format: "",
    },
    {
      name: "userVariableVariableCategoryId",
      baseName: "userVariableVariableCategoryId",
      type: "number",
      format: "",
    },
    {
      name: "userVariableVariableCategoryName",
      baseName: "userVariableVariableCategoryName",
      type: "string",
      format: "",
    },
    {
      name: "valence",
      baseName: "valence",
      type: "string",
      format: "",
    },
    {
      name: "variableCategoryId",
      baseName: "variableCategoryId",
      type: "number",
      format: "",
    },
    {
      name: "variableCategoryImageUrl",
      baseName: "variableCategoryImageUrl",
      type: "string",
      format: "",
    },
    {
      name: "variableCategoryName",
      baseName: "variableCategoryName",
      type: "TrackingReminderNotificationVariableCategoryNameEnum",
      format: "",
    },
    {
      name: "variableId",
      baseName: "variableId",
      type: "number",
      format: "int32",
    },
    {
      name: "variableImageUrl",
      baseName: "variableImageUrl",
      type: "string",
      format: "",
    },
    {
      name: "variableName",
      baseName: "variableName",
      type: "string",
      format: "",
    },
  ]

  static getAttributeTypeMap() {
    return TrackingReminderNotification.attributeTypeMap
  }

  public constructor() {}
}

export type TrackingReminderNotificationCombinationOperationEnum =
  | "MEAN"
  | "SUM"
export type TrackingReminderNotificationVariableCategoryNameEnum =
  | "Activity"
  | "Books"
  | "Causes of Illness"
  | "Cognitive Performance"
  | "Conditions"
  | "Emotions"
  | "Environment"
  | "Foods"
  | "Goals"
  | "Locations"
  | "Miscellaneous"
  | "Movies and TV"
  | "Music"
  | "Nutrients"
  | "Payments"
  | "Physical Activities"
  | "Physique"
  | "Sleep"
  | "Social Interactions"
  | "Software"
  | "Symptoms"
  | "Treatments"
  | "Vital Signs"
