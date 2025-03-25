## Product Requirements Document: Health & Economic Impact Calculator

**1. Introduction**

**1.1. Project Goal:**

To develop a web application that allows users to model and calculate the secondary health and economic benefits resulting from improvements in primary health outcomes due to various interventions. This application will enable users to:

*   Define interventions (e.g., follistatin gene therapy).
*   Define target populations (e.g., Medicare beneficiaries, Arkansas residents).
*   Input primary health outcomes (e.g., increased muscle mass, decreased mortality risk).
*   Define and store equations that link primary outcomes to secondary health and economic benefits (e.g., QALY increase, Medicare savings).
*   Manage parameters used in equations, including default values, sources, and sensitivity analysis ranges.
*   Store source URLs and supporting quotes for all parameters, equations, and outcomes.
*   Visualize calculated secondary benefits in a clear and organized manner.

**1.2. Target Audience:**

Government regulators and policymakers evaluating the potential impact of new therapies and interventions for funding and approval decisions.

**1.3. Example Output:**

(Refer to the "muscle-mass-impact" example provided as the desired output format and level of detail.)

**2. Goals and Non-Goals**

**2.1. Goals:**

*   **Data-Driven Modeling:** Enable users to create and manage models based on scientific evidence and data sources.
*   **Flexible and Extensible:**  Allow users to add and customize interventions, outcomes, parameters, and equations to model various scenarios.
*   **Transparent and Traceable:** Ensure all calculations are traceable back to source data and equations, enhancing credibility and trust.
*   **User-Friendly Interface:** Provide a simple and intuitive interface for users with varying levels of technical expertise.
*   **Mobile-Responsiveness:**  Ensure accessibility and usability across devices (desktops, tablets, and smartphones).

**2.2. Non-Goals:**

*   **Complex Statistical Analysis:**  This application is not intended to perform advanced statistical modeling or simulations beyond basic calculations defined by user-provided equations.
*   **Automated Data Extraction:**  The application will not automatically extract data from external sources. Data entry will be primarily manual.
*   **User Authentication and Authorization:** For the initial version, user accounts and role-based access control are not required. The application is envisioned as publicly accessible for demonstration and evaluation.
*   **Highly Scalable Infrastructure:** While built on scalable technologies (Next.js & Supabase), extreme scalability for millions of concurrent users is not a primary initial focus.

**3. User Stories**

*   **As a government regulator**, I want to be able to easily input details of a new intervention and its primary health outcomes, so I can quickly assess the potential secondary health and economic benefits.
*   **As a government regulator**, I want to see clear calculations and source citations for all parameters and equations, so I can understand the model's assumptions and data sources.
*   **As a government regulator**, I want to be able to explore sensitivity analysis ranges for key parameters, so I can understand the uncertainty and variability in the projected benefits.
*   **As a data administrator**, I want to be able to add new interventions, primary outcomes, secondary outcomes, and parameters into the system with associated equations and supporting evidence (sources and quotes).
*   **As any user**, I want the application to be easy to use and understand, even if I am not a data scientist or programmer.
*   **As any user**, I want the application to work seamlessly on my mobile phone when I am on the go.

**4. Technical Requirements**

**4.1. Frontend:**

*   **Technology:** Next.js (React framework for performant and SEO-friendly web application).
*   **UI Framework/Library:** Tailwind CSS (for rapid styling and responsiveness) and potentially Shadcn UI (for pre-built accessible components).
*   **Responsiveness:** Mobile-first design, ensuring all pages are fully responsive and functional on various screen sizes.
*   **State Management:**  React Context API or Zustand (for simple state management as needed).

**4.2. Backend:**

*   **Database:** Supabase (PostgreSQL database-as-a-service) to store all data: interventions, outcomes, parameters, equations, datasources.
*   **Authentication (Future):** Supabase Auth (for potential future user management if needed).
*   **Functions (Optional):** Supabase Edge Functions (for potentially complex calculations or backend logic if pure database views are insufficient, but prioritize database views for simplicity initially).
*   **API:** RESTful API (provided by Supabase) for frontend to interact with the database.

**4.3. Database Schema (Supabase PostgreSQL)**

*   **`interventions` Table:**
    *   `id` (UUID, Primary Key)
    *   `name` (Text, e.g., "Follistatin Gene Therapy")
    *   `description` (Text)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)

*   **`primary_outcomes` Table:**
    *   `id` (UUID, Primary Key)
    *   `intervention_id` (UUID, Foreign Key referencing `interventions.id`)
    *   `name` (Text, e.g., "Muscle Mass Increase")
    *   `emoji` (Text, e.g., "💪")
    *   `description` (Text)
    *   `unit` (Text, e.g., "lbs", "%")
    *   `default_value` (Numeric)
    *   `best_case_value` (Numeric, optional for sensitivity analysis)
    *   `worst_case_value` (Numeric, optional for sensitivity analysis)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)

*   **`secondary_outcomes` Table:**
    *   `id` (UUID, Primary Key)
    *   `intervention_id` (UUID, Foreign Key referencing `interventions.id`)
    *   `name` (Text, e.g., "Healthcare Cost Savings")
    *   `emoji` (Text, e.g., "💰")
    *   `description` (Text)
    *   `unit` (Text, e.g., "$/year", "QALYs")
    *   `equation_id` (UUID, Foreign Key referencing `equations.id`)  // Link to the equation used for calculation
    *   `calculated_value` (Numeric, calculated and displayed, potentially not stored directly if using DB views)
    *   `best_case_value` (Numeric, optional for sensitivity analysis)
    *   `worst_case_value` (Numeric, optional for sensitivity analysis)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)

*   **`parameters` Table:**
    *   `id` (UUID, Primary Key)
    *   `name` (Text, e.g., "Muscle Calorie Burn Rate")
    *   `emoji` (Text, e.g., "🔥")
    *   `description` (Text)
    *   `unit` (Text, e.g., "calories/lb/day")
    *   `default_value` (Numeric)
    *   `best_case_value` (Numeric, optional for sensitivity analysis)
    *   `worst_case_value` (Numeric, optional for sensitivity analysis)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)

*   **`equations` Table:**
    *   `id` (UUID, Primary Key)
    *   `name` (Text, e.g., "Daily Calories Burned Calculation")
    *   `description` (Text)
    *   `equation_text` (Text, e.g.,  `"muscle_mass_increase * muscle_calorie_burn_rate"` -  **Important:** Define a clear syntax for referencing parameters and primary outcomes. Potentially use placeholders like `{{parameter_name}}` or `{{primary_outcome_name}}` for easier parsing and calculation. Consider storing equations in a format easily evaluated by Javascript or PostgreSQL views.)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)

*   **`datasources` Table:**
    *   `id` (UUID, Primary Key)
    *   `url` (Text, URL of the source)
    *   `quote` (Text, relevant quote from the source)
    *   `created_at` (Timestamp)
    *   `updated_at` (Timestamp)

*   **Junction Tables (Many-to-Many Relationships):**
    *   `parameter_equations` Table: Links parameters to equations they are used in.
        *   `parameter_id` (UUID, Foreign Key referencing `parameters.id`)
        *   `equation_id` (UUID, Foreign Key referencing `equations.id`)
    *   `primary_outcome_equations` Table: Links primary outcomes to equations they are used in.
        *   `primary_outcome_id` (UUID, Foreign Key referencing `primary_outcomes.id`)
        *   `equation_id` (UUID, Foreign Key referencing `equations.id`)
    *   `parameter_datasources` Table: Links parameters to datasources.
        *   `parameter_id` (UUID, Foreign Key referencing `parameters.id`)
        *   `datasource_id` (UUID, Foreign Key referencing `datasources.id`)
    *   `primary_outcome_datasources` Table: Links primary outcomes to datasources.
        *   `primary_outcome_id` (UUID, Foreign Key referencing `primary_outcomes.id`)
        *   `datasource_id` (UUID, Foreign Key referencing `datasources.id`)
    *   `secondary_outcome_datasources` Table: Links secondary outcomes to datasources.
        *   `secondary_outcome_id` (UUID, Foreign Key referencing `secondary_outcomes.id`)
        *   `datasource_id` (UUID, Foreign Key referencing `datasources.id`)
    *   `equation_datasources` Table: Links equations to datasources supporting them.
        *   `equation_id` (UUID, Foreign Key referencing `equations.id`)
        *   `datasource_id` (UUID, Foreign Key referencing `datasources.id`)

**4.4. Calculation Logic:**

*   **Option 1 (Recommended for Simplicity): Database Views (PostgreSQL).**
    *   Create PostgreSQL views that calculate secondary outcomes based on defined equations, referencing parameters and primary outcome values.
    *   This keeps calculations within the database, potentially improving performance and data consistency.
    *   Requires careful design of equation syntax and view logic.
    *   Example view structure:
        ```sql
        CREATE VIEW secondary_outcome_calculations AS
        SELECT
            so.id AS secondary_outcome_id,
            eq.equation_text,
            -- ... logic to parse equation_text and perform calculation using parameters and primary outcomes ...
            -- ... example (simplified and depends on equation syntax): ...
            (po.default_value * p.default_value) AS calculated_value
        FROM secondary_outcomes so
        JOIN equations eq ON so.equation_id = eq.id
        JOIN primary_outcomes po ON ... -- Assuming a way to link primary outcome to secondary outcome in the equation
        JOIN parameters p ON ...        -- Assuming a way to link parameter to secondary outcome in the equation
        ;
        ```

*   **Option 2: Javascript Calculation on Frontend/Backend (Less Recommended for Initial Simplicity).**
    *   Fetch necessary data (equations, parameters, primary outcomes) from Supabase API to the frontend or a Next.js API route.
    *   Implement a Javascript function to parse and evaluate the `equation_text`, replacing parameter and primary outcome references with their values.
    *   This approach offers more flexibility in equation complexity but might be less performant and harder to maintain data consistency compared to database views.

**5. Functional Requirements**

**5.1. Data Input and Management:**

*   **CRUD Operations:**  Ability to Create, Read, Update, and Delete for all data entities:
    *   Interventions
    *   Primary Outcomes
    *   Secondary Outcomes
    *   Parameters
    *   Equations
    *   Datasources
*   **Form Validation:** Implement client-side validation for all input forms to ensure data integrity.
*   **Data Linking:** Intuitive UI for linking primary outcomes to interventions, secondary outcomes to equations, and parameters and outcomes to equations, and all entities to datasources.

**5.2. Calculation Engine:**

*   **Automatic Calculation:**  Secondary outcome calculations should be automatically triggered and updated whenever relevant parameters or primary outcome values are changed. (This is naturally achieved with database views - Option 1).
*   **Equation Display:** Clearly display the equation used for each secondary outcome, showing parameter and primary outcome references.
*   **Sensitivity Analysis Display:**  If best-case and worst-case values are provided for parameters and primary outcomes, allow users to view the resulting sensitivity analysis ranges for secondary outcomes.

**5.3. Reporting/Visualization:**

*   **Intervention Summary Page:** Display a page for each intervention, presenting:
    *   Intervention name and description.
    *   List of Primary Outcomes with their values, emojis, descriptions, units, and sources.
    *   List of Secondary Outcomes with their calculated values, emojis, descriptions, units, equations, and sources.
    *   Parameter lists with values, emojis, descriptions, units, and sources for both Primary and Secondary Outcomes.
    *   Output format should closely resemble the provided "muscle-mass-impact" example.
*   **Clear Presentation of Calculations:**  Visually break down calculations in a step-by-step manner, as shown in the example output.
*   **Source Citation Display:**  Clearly link and display source URLs and quotes for all parameters, outcomes, and equations.

**5.4. Search and Filtering (Optional for initial version, but good to consider):**

*   Basic search functionality to find interventions, outcomes, or parameters by name or description.
*   Filtering options to categorize or group interventions or outcomes.

**6. Non-Functional Requirements**

*   **Performance:** Application should load quickly and calculations should be performed efficiently, providing a smooth user experience.
*   **Maintainability:** Codebase should be well-structured, documented, and easy to understand and maintain.
*   **Responsiveness:**  Application must be fully responsive and accessible on all devices.
*   **Simplicity:**  Prioritize simplicity in design and implementation to meet core requirements efficiently and avoid unnecessary complexity.

**7. UI/UX Requirements**

*   **Clean and Intuitive Design:**  Focus on a clear and uncluttered user interface.
*   **Emoji Integration:**  Utilize emoji fields for visual representation of outcomes and parameters.
*   **Clear Data Presentation:** Present data in a structured and easily digestible format, using tables, lists, and clear headings.
*   **Interactive Elements:**  Use tooltips or modals to display full descriptions, sources, and quotes when hovering over or clicking on elements.
*   **"Example Output" as UI Guide:**  Use the provided "muscle-mass-impact" example as a strong reference for the desired UI structure and information presentation.

**8. Development Considerations**

*   **Technology Choices:**  Confirm Next.js, Supabase, Tailwind CSS stack.
*   **Database View vs. Javascript Calculations:**  Decide on calculation logic approach (database views recommended for initial simplicity).
*   **Equation Parsing and Evaluation:**  Define a clear and robust strategy for parsing and evaluating equations, especially if using database views.
*   **Error Handling:** Implement proper error handling for data input, calculations, and API interactions.
*   **Testing:**  Implement basic unit and integration tests to ensure core functionality is working correctly. Focus on testing calculation logic and data integrity.

**9. Future Enhancements (Beyond MVP)**

*   **User Authentication and Roles:** Implement user accounts with different roles (e.g., admin, viewer).
*   **Data Visualization Dashboards:**  Create interactive dashboards to visualize and compare different interventions and their impacts.
*   **More Complex Calculation Capabilities:**  Support more advanced mathematical functions and conditional logic in equations.
*   **API Access for External Systems:**  Expose an API for external systems to access and utilize the data and calculation engine.
*   **Import/Export Functionality:** Allow users to import and export data in formats like CSV or JSON.

This PRD provides a concise yet thorough guide for developing the Health & Economic Impact Calculator application. By focusing on simplicity, clarity, and the core functional requirements, it aims to minimize potential developer mistakes and ensure the successful creation of a valuable tool for government regulators and policymakers.