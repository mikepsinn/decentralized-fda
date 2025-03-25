-- SQL to Create PostgreSQL Database Schema for Health & Economic Impact Calculator

-- Drop all tables if they exist (in reverse order of dependencies to avoid errors)
DROP VIEW IF EXISTS dynamic_secondary_outcome_calculations;
DROP TABLE IF EXISTS equation_datasources;
DROP TABLE IF EXISTS secondary_outcome_datasources;
DROP TABLE IF EXISTS primary_outcome_datasources;
DROP TABLE IF EXISTS parameter_datasources;
DROP TABLE IF EXISTS primary_outcome_equations;
DROP TABLE IF EXISTS parameter_equations;
DROP TABLE IF EXISTS secondary_outcomes;
DROP TABLE IF EXISTS equations;
DROP TABLE IF EXISTS parameters;
DROP TABLE IF EXISTS primary_outcomes;
DROP TABLE IF EXISTS interventions;
DROP TABLE IF EXISTS datasources;


-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Datasources Table (No dependencies)
CREATE TABLE datasources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    quote TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interventions Table (No dependencies)
CREATE TABLE interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Primary Outcomes Table (Depends on interventions)
CREATE TABLE primary_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_id UUID NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    emoji TEXT,
    description TEXT,
    unit TEXT,
    default_value NUMERIC,
    best_case_value NUMERIC,
    worst_case_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Parameters Table (No dependencies)
CREATE TABLE parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- Parameter names should be unique for easy lookup
    emoji TEXT,
    description TEXT,
    unit TEXT,
    default_value NUMERIC,
    best_case_value NUMERIC,
    worst_case_value NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Equations Table (No dependencies)
CREATE TABLE equations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    equation_text TEXT, -- Store the equation string with placeholders
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Secondary Outcomes Table (Depends on interventions and equations)
CREATE TABLE secondary_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_id UUID NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    emoji TEXT,
    description TEXT,
    unit TEXT,
    equation_id UUID REFERENCES equations(id) ON DELETE SET NULL, -- Allow null if no equation yet
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Junction Tables for Many-to-Many Relationships (Depend on parameters, primary_outcomes, secondary_outcomes, equations, datasources)

-- Parameter-Equations Junction Table
CREATE TABLE parameter_equations (
    parameter_id UUID NOT NULL REFERENCES parameters(id) ON DELETE CASCADE,
    equation_id UUID NOT NULL REFERENCES equations(id) ON DELETE CASCADE,
    PRIMARY KEY (parameter_id, equation_id) -- Composite primary key
);

-- Primary Outcome-Equations Junction Table
CREATE TABLE primary_outcome_equations (
    primary_outcome_id UUID NOT NULL REFERENCES primary_outcomes(id) ON DELETE CASCADE,
    equation_id UUID NOT NULL REFERENCES equations(id) ON DELETE CASCADE,
    PRIMARY KEY (primary_outcome_id, equation_id) -- Composite primary key
);

-- Parameter-Datasources Junction Table
CREATE TABLE parameter_datasources (
    parameter_id UUID NOT NULL REFERENCES parameters(id) ON DELETE CASCADE,
    datasource_id UUID NOT NULL REFERENCES datasources(id) ON DELETE CASCADE,
    PRIMARY KEY (parameter_id, datasource_id) -- Composite primary key
);

-- Primary Outcome-Datasources Junction Table
CREATE TABLE primary_outcome_datasources (
    primary_outcome_id UUID NOT NULL REFERENCES primary_outcomes(id) ON DELETE CASCADE,
    datasource_id UUID NOT NULL REFERENCES datasources(id) ON DELETE CASCADE,
    PRIMARY KEY (primary_outcome_id, datasource_id) -- Composite primary key
);

-- Secondary Outcome-Datasources Junction Table
CREATE TABLE secondary_outcome_datasources (
    secondary_outcome_id UUID NOT NULL REFERENCES secondary_outcomes(id) ON DELETE CASCADE,
    datasource_id UUID NOT NULL REFERENCES datasources(id) ON DELETE CASCADE,
    PRIMARY KEY (secondary_outcome_id, datasource_id) -- Composite primary key
);

-- Equation-Datasources Junction Table
CREATE TABLE equation_datasources (
    equation_id UUID NOT NULL REFERENCES equations(id) ON DELETE CASCADE,
    datasource_id UUID NOT NULL REFERENCES datasources(id) ON DELETE CASCADE,
    PRIMARY KEY (equation_id, datasource_id) -- Composite primary key
);

-- Dynamic Secondary Outcome Calculations View (using CTE to improve syntax compatibility)
CREATE VIEW dynamic_secondary_outcome_calculations AS
WITH ParameterNames AS (
    SELECT
        so.id AS secondary_outcome_id,
        eq.equation_text,
        (regexp_matches(eq.equation_text, '{{parameter:([^}]+)}}'))[1] AS parameter_name_from_placeholder
    FROM secondary_outcomes so
    JOIN equations eq ON so.equation_id = eq.id
)
SELECT
    pnames.secondary_outcome_id,
    pnames.equation_text,
    CASE
        WHEN pnames.equation_text IS NULL THEN NULL
        ELSE
            CAST(
                (SELECT
                    regexp_replace(
                        pnames.equation_text,
                        '{{parameter:([^}]+)}}',
                        (SELECT COALESCE(p.default_value::TEXT, '0')
                         FROM parameters p
                         WHERE p.name = pnames.parameter_name_from_placeholder
                        ),
                        'g'
                    )

                ) AS NUMERIC
            )
    END AS calculated_value
FROM ParameterNames pnames;


-- Optional: Add Indexes on Foreign Keys for improved query performance
CREATE INDEX idx_primary_outcomes_intervention_id ON primary_outcomes (intervention_id);
CREATE INDEX idx_secondary_outcomes_intervention_id ON secondary_outcomes (intervention_id);
CREATE INDEX idx_secondary_outcomes_equation_id ON secondary_outcomes (equation_id);
CREATE INDEX idx_parameter_equations_parameter_id ON parameter_equations (parameter_id);
CREATE INDEX idx_parameter_equations_equation_id ON parameter_equations (equation_id);
CREATE INDEX idx_primary_outcome_equations_primary_outcome_id ON primary_outcome_equations (primary_outcome_id);
CREATE INDEX idx_primary_outcome_equations_equation_id ON primary_outcome_equations (equation_id);
CREATE INDEX idx_parameter_datasources_parameter_id ON parameter_datasources (parameter_id);
CREATE INDEX idx_parameter_datasources_datasource_id ON parameter_datasources (datasource_id);
CREATE INDEX idx_primary_outcome_datasources_primary_outcome_id ON primary_outcome_datasources (primary_outcome_id);
CREATE INDEX idx_primary_outcome_datasources_datasource_id ON primary_outcome_datasources (datasource_id);
CREATE INDEX idx_secondary_outcome_datasources_secondary_outcome_id ON secondary_outcome_datasources (secondary_outcome_id);
CREATE INDEX idx_secondary_outcome_datasources_datasource_id ON secondary_outcome_datasources (datasource_id);
CREATE INDEX idx_equation_datasources_equation_id ON equation_datasources (equation_id);
CREATE INDEX idx_equation_datasources_datasource_id ON equation_datasources (datasource_id);