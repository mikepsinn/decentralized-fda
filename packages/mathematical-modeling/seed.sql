-- Insert datasources
INSERT INTO datasources (url) VALUES
    ('https://pmc.ncbi.nlm.nih.gov/articles/PMC4535334/'),
    ('https://pubmed.ncbi.nlm.nih.gov/32699189/'),
    ('https://pubmed.ncbi.nlm.nih.gov/34054574/'),
    ('https://pmc.ncbi.nlm.nih.gov/articles/PMC8775372/'),
    ('https://pmc.ncbi.nlm.nih.gov/articles/PMC9209691/'),
    ('https://pmc.ncbi.nlm.nih.gov/articles/PMC6089380/'),
    ('https://www.cdc.gov/falls/data/fall-deaths.html'),
    ('https://www.cms.gov/research-statistics-data-and-systems/statistics-trends-and-reports/nationalhealthexpenddata'),
    ('https://www.nature.com/articles/s41598-020-59914-3'),
    ('https://aspe.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf'),
    ('https://aspe.hhs.gov/sites/default/files/documents/e2b650cd64cf84aae8ff0fae7474af82/SDOH-Evidence-Review.pdf');

-- Insert Intervention
INSERT INTO interventions (name, description) VALUES
    ('Muscle Mass Intervention Analysis', 'Analysis of health and economic impacts from increasing muscle mass in a population.');

-- Insert Parameters
INSERT INTO parameters (name, emoji, description, unit, default_value) VALUES
    ('Muscle Calorie Burn Rate', '💪', 'Number of calories burned per pound of muscle per day at rest, based on clinical studies', 'calories/lb/day', 8.0),
    ('Average Resting Metabolic Rate', '🔥', 'Average daily caloric burn at rest for a typical adult', 'calories/day', 1800),
    ('Insulin Sensitivity Improvement per Pound', '📈', 'Improvement in insulin sensitivity per pound of muscle gained, based on clinical trials', '%/lb', 2.0),
    ('Fall Risk Reduction per Pound', '🛡️', 'Reduction in fall risk per pound of muscle gained, supported by meta-analysis showing up to 30% maximum reduction', '%/lb', 1.5),
    ('Mortality Reduction per Pound', '❤️', 'Reduction in mortality risk per pound of muscle gained, with maximum reduction of 20% based on meta-analysis', '%/lb', 1.0),
    ('Cost per Fall', '🏥', 'Average healthcare cost associated with a fall incident based on comprehensive economic analyses', '$', 10000),
    ('Annual Fall Risk', '⚠️', 'Annual probability of experiencing a fall in general population', '% chance', 15.0),
    ('Annual Healthcare Costs', '💰', 'Average annual healthcare expenditure per person', '$', 11000),
    ('Productivity Gain per Pound', '💼', 'Estimated annual productivity gain per pound of muscle mass based on health outcomes research', '$/lb/year', 100);

-- Insert Equations
INSERT INTO equations (name, description, equation_text) VALUES
    ('Daily Calories Burned Calculation', 'Calculates additional daily calories burned due to muscle mass increase', '{{parameter:Muscle Calorie Burn Rate}} * 2'),
    ('Annual Metabolic Impact Calculation', 'Calculates annual metabolic impact', '{{equation:Daily Calories Burned Calculation}} * 365'),
    ('Insulin Sensitivity Improvement Calculation', 'Calculates insulin sensitivity improvement', '{{parameter:Insulin Sensitivity Improvement per Pound}} * 2'),
    ('Fall Risk Reduction Calculation', 'Calculates fall risk reduction, capped at 30%', 'min(30, {{parameter:Fall Risk Reduction per Pound}} * 2)'),
    ('Mortality Risk Reduction Calculation', 'Calculates mortality risk reduction, capped at 20%', 'min(20, {{parameter:Mortality Reduction per Pound}} * 2)'),
    ('Healthcare Cost Savings Calculation', 'Calculates total healthcare cost savings - Placeholder - Complex Calculation Needed', '0'),
    ('Productivity Gains Calculation', 'Calculates total productivity gains - Placeholder - Complex Calculation Needed', '0'),
    ('Total Economic Benefit Calculation', 'Calculates total economic benefit - Placeholder - Sum of other economic benefits', '0'),
    ('Lifetime QALYs Gained Calculation', 'Calculates lifetime QALYs gained', '0.01 * 335000000'),
    ('Medicare Spend Impact Calculation', 'Calculates total Medicare spend impact - Placeholder - Complex Calculation Needed', '0'),
    ('Long-Term Savings Calculation', 'Calculates total long-term savings - Placeholder - Discounted savings', '0');



    -- Insert Primary Outcome
INSERT INTO primary_outcomes (intervention_id, name, emoji, description, unit, default_value) VALUES
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Muscle Mass Increase', '💪', 'Increase in muscle mass per person', 'lbs', 2);

-- Insert Secondary Outcomes (Metabolic Impact)
INSERT INTO secondary_outcomes (intervention_id, name, emoji, description, unit, equation_id) VALUES
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Additional Daily Calories Burned', '🔥', 'Additional calories burned per day per person due to increased muscle mass', 'calories/day/person', (SELECT id FROM equations WHERE name = 'Daily Calories Burned Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Annual Metabolic Impact', '📅', 'Total additional calories burned per year per person due to increased muscle mass', 'calories/year/person', (SELECT id FROM equations WHERE name = 'Annual Metabolic Impact Calculation'));

-- Insert Secondary Outcomes (Health Outcomes)
INSERT INTO secondary_outcomes (intervention_id, name, emoji, description, unit, equation_id) VALUES
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Insulin Sensitivity Improvement', '💉', 'Improvement in insulin sensitivity based on increased muscle mass', '%', (SELECT id FROM equations WHERE name = 'Insulin Sensitivity Improvement Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Fall Risk Reduction', '🚶', 'Reduction in fall risk based on increased muscle mass and strength', '%', (SELECT id FROM equations WHERE name = 'Fall Risk Reduction Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Mortality Risk Reduction', '❤️', 'Reduction in mortality risk based on increased muscle mass', '%', (SELECT id FROM equations WHERE name = 'Mortality Risk Reduction Calculation'));

-- Insert Secondary Outcomes (Economic Impact)
INSERT INTO secondary_outcomes (intervention_id, name, emoji, description, unit, equation_id) VALUES
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Healthcare Cost Savings', '💰', 'Total annual healthcare cost savings from improved health outcomes across population', '$/year total', (SELECT id FROM equations WHERE name = 'Healthcare Cost Savings Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Productivity Gains', '📈', 'Total annual economic gains from improved workforce productivity across population, based on cognitive performance improvements', '$/year total', (SELECT id FROM equations WHERE name = 'Productivity Gains Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Total Economic Benefit', '💎', 'Total annual economic benefit including healthcare savings, productivity gains, and monetized QALY value across population', '$/year total', (SELECT id FROM equations WHERE name = 'Total Economic Benefit Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Lifetime QALYs Gained', '✨', 'Total lifetime quality-adjusted life years gained across population based on systematic review and meta-analysis of SMI impact on mortality', 'lifetime QALYs total', (SELECT id FROM equations WHERE name = 'Lifetime QALYs Gained Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Medicare Spend Impact', '🏥', 'Total annual impact on Medicare spending from improved health outcomes across Medicare-eligible population', '$/year total', (SELECT id FROM equations WHERE name = 'Medicare Spend Impact Calculation')),
    ((SELECT id FROM interventions WHERE name = 'Muscle Mass Intervention Analysis'), 'Long-Term Savings', '🎯', 'Total projected 10-year savings with discounted future value across population', '$/year total', (SELECT id FROM equations WHERE name = 'Long-Term Savings Calculation'));


    -- Junction Table Insertions (Parameter-Equations)
INSERT INTO parameter_equations (parameter_id, equation_id) VALUES
    ((SELECT id FROM parameters WHERE name = 'Muscle Calorie Burn Rate'), 
     (SELECT id FROM equations WHERE name = 'Daily Calories Burned Calculation')),
    
    ((SELECT id FROM parameters WHERE name = 'Muscle Calorie Burn Rate'), 
     (SELECT id FROM equations WHERE name = 'Annual Metabolic Impact Calculation')),
    
    ((SELECT id FROM parameters WHERE name = 'Insulin Sensitivity Improvement per Pound'), 
     (SELECT id FROM equations WHERE name = 'Insulin Sensitivity Improvement Calculation')),
    
    ((SELECT id FROM parameters WHERE name = 'Fall Risk Reduction per Pound'), 
     (SELECT id FROM equations WHERE name = 'Fall Risk Reduction Calculation')),
    
    ((SELECT id FROM parameters WHERE name = 'Mortality Reduction per Pound'), 
     (SELECT id FROM equations WHERE name = 'Mortality Risk Reduction Calculation'));


     -- Create a temporary table to map URLs to datasource IDs
CREATE TEMPORARY TABLE temp_datasource_map (
    url TEXT,
    id UUID
);

-- Populate the temporary table
INSERT INTO temp_datasource_map (url, id)
SELECT url, id FROM datasources;

-- Junction Table Insertions (Parameter-Datasources)
INSERT INTO parameter_datasources (parameter_id, datasource_id) VALUES
    ((SELECT id FROM parameters WHERE name = 'Muscle Calorie Burn Rate'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4535334/')),
    
    ((SELECT id FROM parameters WHERE name = 'Average Resting Metabolic Rate'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://pubmed.ncbi.nlm.nih.gov/32699189/')),
    
    ((SELECT id FROM parameters WHERE name = 'Insulin Sensitivity Improvement per Pound'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://pubmed.ncbi.nlm.nih.gov/34054574/')),
    
    ((SELECT id FROM parameters WHERE name = 'Fall Risk Reduction per Pound'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8775372/')),
    
    ((SELECT id FROM parameters WHERE name = 'Mortality Reduction per Pound'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9209691/')),
    
    ((SELECT id FROM parameters WHERE name = 'Cost per Fall'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6089380/')),
    
    ((SELECT id FROM parameters WHERE name = 'Annual Fall Risk'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://www.cdc.gov/falls/data/fall-deaths.html')),
    
    ((SELECT id FROM parameters WHERE name = 'Annual Healthcare Costs'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://www.cms.gov/research-statistics-data-and-systems/statistics-trends-and-reports/nationalhealthexpenddata')),
    
    ((SELECT id FROM parameters WHERE name = 'Productivity Gain per Pound'), 
     (SELECT id FROM temp_datasource_map WHERE url = 'https://aspe.hhs.gov/sites/default/files/surgeon-general-social-connection-advisory.pdf'));

-- Drop the temporary table
DROP TABLE temp_datasource_map;