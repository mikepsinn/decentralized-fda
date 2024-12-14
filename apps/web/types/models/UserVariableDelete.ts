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

export class UserVariableDelete {
  /**
   * Id of the variable whose measurements should be deleted
   */
  "variableId": number

  static readonly discriminator: string | undefined = undefined

  static readonly attributeTypeMap: Array<{
    name: string
    baseName: string
    type: string
    format: string
  }> = [
    {
      name: "variableId",
      baseName: "variableId",
      type: "number",
      format: "",
    },
  ]

  static getAttributeTypeMap() {
    return UserVariableDelete.attributeTypeMap
  }

  public constructor() {}
}
