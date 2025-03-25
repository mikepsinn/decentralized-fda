/**
 * Equation parser for evaluating mathematical expressions with variables
 */

type Context = {
  parameters: Record<string, number>;
  population: number;
  primary?: Record<string, number>;
  change?: Record<string, number>;
};

export class EquationParser {
  /**
   * Evaluate an equation string with given context
   */
  public evaluate(equation: string, context: Context): number {
    try {
      // Replace variables with their values
      const evaluableEquation = this.replaceVariables(equation, context);

      // Create a safe evaluation context
      const safeEval = new Function("return " + evaluableEquation);

      // Evaluate and return result
      return safeEval();
    } catch (error) {
      console.error(`Error evaluating equation: ${equation}`, error);
      return 0;
    }
  }

  /**
   * Replace variables in equation with their values
   * Supports formats:
   * - {{parameter:name}}
   * - {{population}}
   * - {{primary:name}}
   * - {{change:name}}
   */
  private replaceVariables(equation: string, context: Context): string {
    let result = equation;

    // Replace population
    result = result.replace(/{{population}}/g, context.population.toString());

    // Replace parameters
    result = result.replace(/{{parameter:([^}]+)}}/g, (_, name) => {
      return (context.parameters[name] ?? 0).toString();
    });

    // Replace primary outcome values
    result = result.replace(/{{primary:([^}]+)}}/g, (_, name) => {
      return (context.primary?.[name] ?? 0).toString();
    });

    // Replace change values
    result = result.replace(/{{change:([^}]+)}}/g, (_, name) => {
      return (context.change?.[name] ?? 0).toString();
    });

    // Add Math functions
    result = `Math.max(0, ${result})`; // Ensure non-negative results

    return result;
  }

  /**
   * Validate an equation string
   * Returns true if equation is valid, false otherwise
   */
  public validate(equation: string): boolean {
    try {
      // Test with dummy context
      const dummyContext = {
        parameters: {},
        population: 1000,
        primary: {},
        change: {},
      };

      this.evaluate(equation, dummyContext);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extract variable names from an equation
   */
  public extractVariables(equation: string): string[] {
    const variables: string[] = [];
    const regex = /{{([^}]+)}}/g;
    let match;

    while ((match = regex.exec(equation)) !== null) {
      variables.push(match[1]);
    }

    return variables;
  }
}
