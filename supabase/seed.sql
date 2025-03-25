-- Seed data for core
-- Seed: core.user_groups
-- Seed data for core.user_groups

INSERT INTO core.user_groups (name, description) VALUES
('administrators', 'System administrators with full access'),
('staff', 'Staff members with elevated privileges'),
('researchers', 'Research team members'),
('providers', 'Healthcare providers'),
('patients', 'Regular patients/users');


-- Seed: core.user_permissions
-- Seed data for core.user_permissions

INSERT INTO core.user_permissions (permission, description) VALUES
('manage_users', 'Can manage user accounts'),
('view_users', 'Can view user profiles'),
('manage_trials', 'Can manage clinical trials'),
('view_trials', 'Can view clinical trial data'),
('manage_medical', 'Can manage medical records'),
('view_medical', 'Can view medical records'),
('manage_commerce', 'Can manage e-commerce operations'),
('view_commerce', 'Can view e-commerce data'),
('manage_scheduling', 'Can manage scheduling'),
('view_scheduling', 'Can view schedules'),
('manage_logistics', 'Can manage logistics'),
('view_logistics', 'Can view logistics data'),
('manage_finances', 'Can manage financial operations'),
('view_finances', 'Can view financial data'),
('manage_oauth2', 'Can manage OAuth2 applications'),
('view_oauth2', 'Can view OAuth2 data');


-- Seed data for reference
-- Seed: reference.data_quality_rules
-- Seed data for reference.data_quality_rules

INSERT INTO reference.data_quality_rules 
(name, description, rule_type, validation_function, error_message, severity, applies_to_table, applies_to_column) 
VALUES 
('FUTURE_DATE_CHECK', 
 'Ensures dates are not in the future', 
 'DATE_VALIDATION',
 'date <= CURRENT_DATE',
 'Date cannot be in the future',
 'ERROR',
 NULL,
 NULL),

('NEGATIVE_VALUE_CHECK',
 'Ensures numeric values are not negative when inappropriate',
 'NUMERIC_VALIDATION',
 'value >= 0',
 'Value cannot be negative',
 'ERROR',
 NULL,
 NULL),

('OUTLIER_CHECK',
 'Flags statistical outliers for review',
 'STATISTICAL_VALIDATION',
 'ABS((value - avg) / stddev) <= 3',
 'Value is a statistical outlier',
 'WARNING',
 NULL,
 NULL),

('MISSING_REQUIRED_CHECK',
 'Ensures required fields are not null',
 'NULL_VALIDATION',
 'value IS NOT NULL',
 'Required field cannot be null',
 'ERROR',
 NULL,
 NULL),

('DUPLICATE_CHECK',
 'Identifies potential duplicate entries',
 'DUPLICATE_VALIDATION',
 'COUNT(*) = 1',
 'Potential duplicate entry detected',
 'WARNING',
 NULL,
 NULL);


-- Seed: reference.lab_test_types
-- Seed data for reference.lab_test_types

INSERT INTO reference.lab_test_types (name, display_name, description) VALUES
('blood_glucose', 'Blood Glucose', 'Blood glucose level measurement'),
('hemoglobin_a1c', 'Hemoglobin A1C', 'Hemoglobin A1C percentage measurement'),
('total_cholesterol', 'Total Cholesterol', 'Total cholesterol level measurement'),
('hdl_cholesterol', 'HDL Cholesterol', 'HDL cholesterol level measurement'),
('ldl_cholesterol', 'LDL Cholesterol', 'LDL cholesterol level measurement'),
('triglycerides', 'Triglycerides', 'Triglycerides level measurement'),
('blood_pressure_systolic', 'Systolic Blood Pressure', 'Systolic blood pressure measurement'),
('blood_pressure_diastolic', 'Diastolic Blood Pressure', 'Diastolic blood pressure measurement'),
('heart_rate', 'Heart Rate', 'Heart rate measurement'),
('body_temperature', 'Body Temperature', 'Body temperature measurement');


-- Seed: reference.units_of_measurement
-- Seed data for reference.units_of_measurement

INSERT INTO reference.units_of_measurement (
    id, name, abbreviation, unit_category_id, minimum_value, maximum_value,
    filling_type, scale, advanced, manual_tracking, conversion_steps, maximum_daily_value,
    slug, code_system, code
) VALUES
-- Duration units (Existing)
('seconds', 'Seconds', 's', 'duration', 0, NULL, 'zero', 'ratio', true, false, '[]', 86400, 'seconds', 'ucum', 's'),
('minutes', 'Minutes', 'min', 'duration', 0, 10080, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":60}]', 1440, 'minutes', 'ucum', 'min'),
('hours', 'Hours', 'h', 'duration', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":3600}]', 24, 'hours', 'ucum', 'h'),
('milliseconds', 'Milliseconds', 'ms', 'duration', 0, 864000000, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.001}]', 86400000, 'milliseconds', 'ucum', 'ms'),
('days', 'Days', 'd', 'duration', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":86400}]', 1, 'days', 'ucum', 'd'),
('weeks', 'Weeks', 'wk', 'duration', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":604800}]', 1, 'weeks', 'ucum', 'wk'),
('months', 'Months', 'mo', 'duration', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":2592000}]', 1, 'months', 'ucum', 'mo'),
('years', 'Years', 'a', 'duration', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":31536000}]', 1, 'years', 'ucum', 'a'),

-- Distance units (Existing)
('meters', 'Meters', 'm', 'distance', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'meters', 'ucum', 'm'),
('kilometers', 'Kilometers', 'km', 'distance', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1000}]', NULL, 'kilometers', 'ucum', 'km'),
('centimeters', 'Centimeters', 'cm', 'distance', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.01}]', NULL, 'centimeters', 'ucum', 'cm'),
('millimeters', 'Millimeters', 'mm', 'distance', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.001}]', NULL, 'millimeters', 'ucum', 'mm'),
('miles', 'Miles', 'mi', 'distance', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1609.34}]', NULL, 'miles', 'ucum', 'mi'),
('inches', 'Inches', 'in', 'distance', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.0254}]', NULL, 'inches', 'ucum', 'in'),
('feet', 'Feet', 'ft', 'distance', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.3048}]', NULL, 'feet', 'ucum', 'ft'),
('micrometers', 'Micrometers', 'µm', 'distance', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1e-6}]', NULL, 'micrometers', 'ucum', 'um'), -- UCUM addition

-- Area units (Existing)
('square-meters', 'Square Meters', 'm²', 'area', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'square-meters', 'ucum', 'm2'),
('square-centimeters', 'Square Centimeters', 'cm²', 'area', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.0001}]', NULL, 'square-centimeters', 'ucum', 'cm2'),
('square-millimeters', 'Square Millimeters', 'mm²', 'area', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.000001}]', NULL, 'square-millimeters', 'ucum', 'mm2'),
('square-inches', 'Square Inches', 'in²', 'area', 0, NULL, 'none', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.00064516}]', NULL, 'square-inches', 'ucum', 'in2'),

-- Weight units (Existing)
('kilograms', 'Kilograms', 'kg', 'weight', 0, NULL, 'none', 'ratio', true, true, '[]', NULL, 'kilograms', 'ucum', 'kg'),
('grams', 'Grams', 'g', 'weight', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":0.001}]', NULL, 'grams', 'ucum', 'g'),
('milligrams', 'Milligrams', 'mg', 'weight', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":1.0e-6}]', 1000000, 'milligrams', 'ucum', 'mg'),
('micrograms', 'Micrograms', 'mcg', 'weight', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1.0e-6}]', 10000, 'micrograms', 'ucum', 'mcg'),
('pounds', 'Pounds', 'lb', 'weight', 0, 1000, 'none', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.453592}]', NULL, 'pounds', 'ucum', 'lb'),
('ounces', 'Ounces', 'oz', 'weight', 0, NULL, 'none', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.0283495}]', NULL, 'ounces', 'ucum', 'oz'),
('metric-tons', 'Metric Tons', 't', 'weight', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1000}]', NULL, 'metric-tons', 'ucum', 't'),
('nanograms', 'Nanograms', 'ng', 'weight', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1.0e-12}]', NULL, 'nanograms', 'ucum', 'ng'),
('picograms', 'Picograms', 'pg', 'weight', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1.0e-15}]', NULL, 'picograms', 'ucum', 'pg'), -- UCUM addition
('femtograms', 'Femtograms', 'fg', 'weight', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1.0e-18}]', NULL, 'femtograms', 'ucum', 'fg'), -- UCUM addition

-- Volume units (Existing)
('milliliters', 'Milliliters', 'mL', 'volume', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":0.001}]', 1000000, 'milliliters', 'ucum', 'mL'),
('liters', 'Liters', 'L', 'volume', 0, NULL, 'zero', 'ratio', true, true, '[]', 10, 'liters', 'ucum', 'L'),
('quarts', 'Quarts', 'qt', 'volume', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.946353}]', NULL, 'quarts', 'ucum', 'qt'),
('cubic-meters', 'Cubic Meters', 'm³', 'volume', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1000}]', NULL, 'cubic-meters', 'ucum', 'm3'),
('cubic-centimeters', 'Cubic Centimeters', 'cm³', 'volume', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.001}]', NULL, 'cubic-centimeters', 'ucum', 'cm3'),
('fluid-ounces', 'Fluid Ounces', 'fl_oz', 'volume', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.0295735}]', NULL, 'fluid-ounces', 'ucum', 'fl_oz'),
('milliliters-per-hour', 'Milliliters per Hour', 'mL/h', 'volume', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.001}]', NULL, 'milliliters-per-hour', 'ucum', 'mL/h'),
('microliters', 'Microliters', 'µL', 'volume', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1e-6}]', NULL, 'microliters', 'ucum', 'uL'), -- UCUM addition
('nanoliters', 'Nanoliters', 'nL', 'volume', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1e-9}]', NULL, 'nanoliters', 'ucum', 'nL'), -- UCUM addition
('picoliters', 'Picoliters', 'pL', 'volume', 0, NULL, 'zero', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1e-12}]', NULL, 'picoliters', 'ucum', 'pL'), -- UCUM addition

-- Rating units (Existing)
('rating-1-to-5', '1 to 5 Rating', '/5', 'rating', 1, 5, 'none', 'ordinal', false, true, '[{"operation":"MULTIPLY","value":25},{"operation":"ADD","value":-25}]', NULL, 'rating-1-to-5', NULL, NULL),
('rating-0-to-1', '0 to 1 Rating', '/1', 'rating', 0, 1, 'none', 'ordinal', true, false, '[{"operation":"MULTIPLY","value":100}]', NULL, 'rating-0-to-1', NULL, NULL),
('rating-1-to-10', '1 to 10 Rating', '/10', 'rating', 1, 10, 'none', 'ordinal', false, true, '[{"operation":"MULTIPLY","value":11.111111111111},{"operation":"ADD","value":-11.111111111111}]', NULL, 'rating-1-to-10', NULL, NULL),
('rating-minus-4-to-4', '-4 to 4 Rating', '-4 to 4', 'rating', -4, 4, 'none', 'ordinal', true, false, '[{"operation":"ADD","value":4},{"operation":"MULTIPLY","value":12.5}]', NULL, 'rating-minus-4-to-4', NULL, NULL),
('rating-0-to-5', '0 to 5 Rating', '/6', 'rating', 0, 5, 'none', 'ordinal', true, false, '[{"operation":"MULTIPLY","value":20}]', NULL, 'rating-0-to-5', NULL, NULL),
('rating-1-to-3', '1 to 3 Rating', '/3', 'rating', 1, 3, 'none', 'ordinal', true, true, '[{"operation":"MULTIPLY","value":50},{"operation":"ADD","value":-50}]', NULL, 'rating-1-to-3', NULL, NULL),

-- Proportion units (Existing)
('percent', 'Percent', '%', 'proportion', NULL, NULL, 'none', 'interval', true, true, '[]', NULL, 'percent', 'ucum', '%'),

-- Miscellany units (Existing)
('index', 'Index', 'index', 'miscellany', 0, NULL, 'none', 'ordinal', true, false, '[]', NULL, 'index', NULL, NULL),
('degrees-east', 'Degrees East', 'degrees east', 'miscellany', NULL, NULL, 'none', 'interval', true, false, '[]', NULL, 'degrees-east', NULL, NULL),
('degrees-north', 'Degrees North', 'degrees north', 'miscellany', NULL, NULL, 'none', 'interval', true, false, '[]', NULL, 'degrees-north', NULL, NULL),
('percent-rda', '% Recommended Daily Allowance', '%RDA', 'miscellany', 0, NULL, 'none', 'ratio', true, false, '[]', 10000, 'percent-rda', NULL, NULL),
('international-units', 'International Units', 'IU', 'miscellany', 0, NULL, 'zero', 'ratio', true, true, '[]', NULL, 'international-units', 'ucum', 'IU'),
('parts-per-million', 'Parts per Million', 'ppm', 'miscellany', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'parts-per-million', 'ucum', 'ppm'),
('decibels', 'Decibels', 'dB', 'miscellany', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'decibels', 'ucum', 'dB'),
('ph', 'pH', 'pH', 'miscellany', 0, 14, 'none', 'ratio', true, false, '[]', NULL, 'ph', 'ucum', '[pH]'), -- UCUM addition for pH
('beats', 'Beats', 'beats', 'miscellany', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'beats', 'ucum', 'beats'), -- UCUM addition for beats (as a count)
('breaths', 'Breaths', 'breaths', 'miscellany', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'breaths', 'ucum', 'breaths'), -- UCUM addition for breaths (as a count)

-- Energy units (Existing)
('kilocalories', 'Kilocalories', 'kcal', 'energy', NULL, NULL, 'none', 'ratio', true, false, '[]', 20000, 'kilocalories', 'ucum', 'kcal'),
('calories', 'Calories', 'cal', 'energy', NULL, NULL, 'none', 'ratio', true, false, '[]', 20000, 'calories', 'ucum', 'cal'),
('gigabecquerel', 'Gigabecquerel', 'GBq', 'energy', NULL, NULL, 'none', 'interval', true, true, '[]', NULL, 'gigabecquerel', 'ucum', 'GBq'),
('joules', 'Joules', 'J', 'energy', NULL, NULL, 'none', 'ratio', true, false, '[]', NULL, 'joules', 'ucum', 'J'), -- UCUM addition
('kilojoules', 'Kilojoules', 'kJ', 'energy', NULL, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1000}]', NULL, 'kilojoules', 'ucum', 'kJ'), -- UCUM addition
('electron-volts', 'Electron Volts', 'eV', 'energy', NULL, NULL, 'none', 'ratio', true, false, '[]', NULL, 'electron-volts', 'ucum', 'eV'), -- UCUM addition

-- Frequency/Rate units (Existing)
('per-minute', 'per Minute', '/minute', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'per-minute', 'ucum', '/min'),
('meters-per-second', 'Meters per Second', 'm/s', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'meters-per-second', 'ucum', 'm/s'),
('beats-per-minute', 'Beats per Minute', 'bpm', 'frequency', 20, 300, 'none', 'ratio', true, false, '[]', NULL, 'beats-per-minute', 'ucum', 'bpm'),
('miles-per-hour', 'Miles per Hour', 'mph', 'frequency', 0, NULL, 'none', 'ratio', true, true, '[]', NULL, 'miles-per-hour', 'ucum', 'mph'),
('per-second', 'per Second', '/s', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'per-second', 'ucum', '/s'),
('per-hour', 'per Hour', '/h', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'per-hour', 'ucum', '/h'),
('kilometers-per-hour', 'Kilometers per Hour', 'km/h', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.277778}]', NULL, 'kilometers-per-hour', 'ucum', 'km/h'),
('revolutions-per-minute', 'Revolutions per Minute', 'rpm', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'revolutions-per-minute', 'ucum', 'rpm'), -- UCUM addition
('breaths-per-minute', 'Breaths per Minute', 'breaths/minute', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'breaths-per-minute', 'ucum', 'breaths/min'), -- UCUM addition

-- Pressure units (Existing)
('millimeters-mercury', 'Millimeters Merc', 'mmHg', 'pressure', 1, 100000, 'none', 'ratio', true, true, '[{"operation":"MULTIPLY","value":133.32239}]', NULL, 'millimeters-mercury', 'ucum', 'mmHg'),
('pascal', 'Pascal', 'Pa', 'pressure', 10132, 1113250, 'none', 'ratio', true, false, '[]', NULL, 'pascal', 'ucum', 'Pa'),
('torr', 'Torr', 'torr', 'pressure', 76, 7600, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":133.322}]', NULL, 'torr', 'ucum', 'Torr'),
('millibar', 'Millibar', 'mbar', 'pressure', 101, 10130, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":133.32239}]', NULL, 'millibar', 'ucum', 'mbar'),
('hectopascal', 'Hectopascal', 'hPa', 'pressure', 101.32, 11132.5, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":100}]', NULL, 'hectopascal', 'ucum', 'hPa'),
('kilopascals', 'Kilopascals', 'kPa', 'pressure', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1000}]', NULL, 'kilopascals', 'ucum', 'kPa'),
('atmospheres', 'Atmospheres', 'atm', 'pressure', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":101325}]', NULL, 'atmospheres', 'ucum', 'atm'),
('centimeters-of-water', 'Centimeters of Water', 'cmH2O', 'pressure', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":98.0638}]', NULL, 'centimeters-of-water', 'ucum', 'cmH2O'), -- UCUM addition

-- Temperature units (Existing)
('fahrenheit', 'Degrees Fahrenheit', 'F', 'temperature', -87, 214, 'none', 'interval', true, true, '[{"operation":"ADD","value":-32},{"operation":"MULTIPLY","value":0.55555555555556}]', NULL, 'fahrenheit', 'ucum', '[degF]'),
('celsius', 'Degrees Celsius', 'C', 'temperature', -66, 101, 'none', 'interval', true, true, '[]', NULL, 'celsius', 'ucum', '[degC]'),
('kelvin', 'Kelvin', 'K', 'temperature', 0, NULL, 'none', 'interval', true, false, '[{"operation":"ADD","value":-273.15}]', NULL, 'kelvin', 'ucum', '[degK]'), -- UCUM addition

-- Currency units (Existing)
('dollars', 'Dollars', '$', 'currency', NULL, NULL, 'zero', 'ratio', true, false, '[]', NULL, 'dollars', NULL, '$'),

-- Concentration units (Existing)
('moles-per-liter', 'Moles per Liter', 'mol/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'moles-per-liter', 'ucum', 'mol/L'),
('millimoles-per-liter', 'Millimoles per Liter', 'mmol/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.001}]', NULL, 'millimoles-per-liter', 'ucum', 'mmol/L'),
('units-per-liter', 'Units per Liter', 'U/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'units-per-liter', 'ucum', 'U/L'),
('milligrams-per-milliliter', 'Milligrams per Milliliter', 'mg/mL', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'milligrams-per-milliliter', 'ucum', 'mg/mL'),
('nanograms-per-milliliter', 'Nanograms per Milliliter', 'ng/mL', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1e-6}]', NULL, 'nanograms-per-milliliter', 'ucum', 'ng/mL'),
('millimoles-per-kilogram', 'Millimoles per Kilogram', 'mmol/kg', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'millimoles-per-kilogram', 'ucum', 'mmol/kg'),
('milligrams-per-deciliter', 'Milligrams per Deciliter', 'mg/dL', 'concentration', 0, NULL, 'none', 'ratio', true, true, '[{"operation":"MULTIPLY","value":0.01}]', NULL, 'milligrams-per-deciliter', 'ucum', 'mg/dL'),
('micrograms-per-milliliter', 'Micrograms per Milliliter', 'μg/mL', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":0.001}]', NULL, 'micrograms-per-milliliter', 'ucum', 'ug/mL'),
('grams-per-liter', 'Grams per Liter', 'g/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'grams-per-liter', 'ucum', 'g/L'),
('moles-per-cubic-meter', 'Moles per Cubic Meter', 'mol/m³', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'moles-per-cubic-meter', 'ucum', 'mol/m3'),
('picograms-per-milliliter', 'Picograms per Milliliter', 'pg/mL', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1e-9}]', NULL, 'picograms-per-milliliter', 'ucum', 'pg/mL'), -- UCUM addition
('femtomoles-per-liter', 'Femtomoles per Liter', 'fmol/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[{"operation":"MULTIPLY","value":1e-15}]', NULL, 'femtomoles-per-liter', 'ucum', 'fmol/L'), -- UCUM addition
('international-units-per-liter', 'International Units per Liter', 'IU/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'international-units-per-liter', 'ucum', 'IU/L'), -- UCUM addition
('copies-per-milliliter', 'Copies per Milliliter', 'copies/mL', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'copies-per-milliliter', 'ucum', 'copies/mL'), -- UCUM addition (common in viral loads)
('milligrams-per-kilogram', 'Milligrams per Kilogram', 'mg/kg', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'milligrams-per-kilogram', 'ucum', 'mg/kg'), -- UCUM addition (dosage)
('micrograms-per-kilogram', 'Micrograms per Kilogram', 'mcg/kg', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'micrograms-per-kilogram', 'ucum', 'ug/kg'), -- UCUM addition (dosage)
('nanograms-per-kilogram', 'Nanograms per Kilogram', 'ng/kg', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'nanograms-per-kilogram', 'ucum', 'ng/kg'), -- UCUM addition (dosage)

-- Count units (Existing)
('tablets', 'Tablets', 'tablets', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', 20, 'tablets', NULL, NULL),
('units', 'Units', 'units', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'units', NULL, NULL),
('puffs', 'Puffs', 'puffs', 'count', 0, 100, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'puffs', NULL, NULL),
('applications', 'Applications', 'applications', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', 20, 'applications', NULL, NULL),
('yes-no', 'Yes/No', 'yes/no', 'count', 0, 1, 'zero', 'ordinal', false, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'yes-no', NULL, NULL),
('count', 'Count', 'count', 'count', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'count', NULL, NULL),
('pills', 'Pills', 'pills', 'count', 0, 20, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', 100, 'pills', NULL, NULL),
('capsules', 'Capsules', 'capsules', 'count', 0, 1000, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', 20, 'capsules', NULL, NULL),
('pieces', 'Pieces', 'pieces', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', 100, 'pieces', NULL, NULL),
('event', 'Event', 'event', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'event', NULL, NULL),
('serving', 'Serving', 'serving', 'count', 0, NULL, 'zero', 'ratio', false, true, '[{"operation":"MULTIPLY","value":1}]', 40, 'serving', NULL, NULL),
('sprays', 'Sprays', 'sprays', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', 50, 'sprays', NULL, NULL),
('drops', 'Drops', 'drops', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', 100, 'drops', NULL, NULL),
('doses', 'Doses', 'dose', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'doses', NULL, NULL),
('cells', 'Cells', 'cells', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'cells', 'ucum', 'cells'), -- UCUM addition - general cell count
('copies', 'Copies', 'copies', 'count', 0, NULL, 'zero', 'ratio', true, true, '[{"operation":"MULTIPLY","value":1}]', NULL, 'copies', 'ucum', 'copies'), -- UCUM addition - gene copies etc

-- Dosage Units (can be categorized under a new category 'dosage' or 'concentration' or 'miscellany' - using 'concentration' for now as it's related to amount per body weight/area)
('milligrams-per-square-meter', 'Milligrams per Square Meter', 'mg/m²', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'milligrams-per-square-meter', 'ucum', 'mg/m2'), -- UCUM addition (BSA dosage)
('micrograms-per-square-meter', 'Micrograms per Square Meter', 'mcg/m²', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'micrograms-per-square-meter', 'ucum', 'ug/m2'), -- UCUM addition (BSA dosage)
('nanograms-per-square-meter', 'Nanograms per Square Meter', 'ng/m²', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'nanograms-per-square-meter', 'ucum', 'ng/m2'), -- UCUM addition (BSA dosage)

-- Hematology/Cell Count Units (can be under 'count' or new category 'hematology' - using 'count' for now)
('cells-per-liter', 'Cells per Liter', 'cells/L', 'count', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'cells-per-liter', 'ucum', 'cells/L'), -- UCUM addition - general cells/L
('cells-per-microliter', 'Cells per Microliter', 'cells/µL', 'count', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'cells-per-microliter', 'ucum', 'cells/uL'), -- UCUM addition
('10-9-per-liter', '10^9 per Liter', '10^9/L', 'count', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, '10-9-per-liter', 'ucum', '10*9/L'), -- UCUM addition (WBC, RBC counts)
('10-12-per-liter', '10^12 per Liter', '10^12/L', 'count', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, '10-12-per-liter', 'ucum', '10*12/L'), -- UCUM addition (Platelet counts)
('femtoliters', 'Femtoliters', 'fL', 'volume', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'femtoliters', 'ucum', 'fL'), -- UCUM addition (RBC volume - MCV)

-- Time Rates (can be under 'frequency' or new 'rate' category - using 'frequency')
('per-day', 'per Day', '/day', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'per-day', 'ucum', '/d'), -- UCUM addition
('per-week', 'per Week', '/week', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'per-week', 'ucum', '/wk'), -- UCUM addition
('per-month', 'per Month', '/month', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'per-month', 'ucum', '/mo'), -- UCUM addition
('per-year', 'per Year', '/year', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'per-year', 'ucum', '/a'), -- UCUM addition

-- Flow Rates (can be under 'frequency' or new 'flow rate' - using 'frequency')
('milliliters-per-minute', 'Milliliters per Minute', 'mL/min', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'milliliters-per-minute', 'ucum', 'mL/min'), -- UCUM addition
('liters-per-minute', 'Liters per Minute', 'L/min', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'liters-per-minute', 'ucum', 'L/min'), -- UCUM addition
('liters-per-hour', 'Liters per Hour', 'L/h', 'frequency', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'liters-per-hour', 'ucum', 'L/h'), -- UCUM addition

-- Osmolality (new category 'osmolality') - Assuming 'osmolality' category exists or will be created. If not, use 'concentration' or 'miscellany'
('milliosmoles-per-kilogram', 'Milliosmoles per Kilogram', 'mOsm/kg', 'osmolality', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'milliosmoles-per-kilogram', 'ucum', 'mOsm/kg'), -- UCUM addition
('milliosmoles-per-liter', 'Milliosmoles per Liter', 'mOsm/L', 'osmolality', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'milliosmoles-per-liter', 'ucum', 'mOsm/L'), -- UCUM addition

-- Electrolyte Concentration (under 'concentration')
('milliequivalents-per-liter', 'Milliequivalents per Liter', 'mEq/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'milliequivalents-per-liter', 'ucum', 'mEq/L'), -- UCUM addition

-- Enzyme Activity (under 'concentration' or new 'enzyme activity' category - using 'concentration')
('katals-per-liter', 'Katals per Liter', 'kat/L', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'katals-per-liter', 'ucum', 'kat/L'), -- UCUM addition - SI unit for enzyme activity
('units-per-milliliter', 'Units per Milliliter', 'U/mL', 'concentration', 0, NULL, 'none', 'ratio', true, false, '[]', NULL, 'units-per-milliliter', 'ucum', 'U/mL'); -- UCUM addition

-- Angle (new category 'angle' or 'miscellany' - using 'miscellany')
('degrees', 'Degrees', 'deg', 'miscellany', NULL, NULL, 'none', 'interval', true, false, '[]', NULL, 'degrees', 'ucum', '[deg]'); -- UCUM addition for angles

-- Ratio Units (new category 'ratio' or 'proportion' or 'miscellany' - using 'proportion')
('moles-per-mole', 'Moles per Mole', 'mol/mol', 'proportion', 0, 1, 'none', 'ratio', true, false, '[]', NULL, 'moles-per-mole', 'ucum', 'mol/mol'); -- UCUM addition - dimensionless ratio

-- Seed: reference.unit_categories
-- Seed data for reference.unit_categories

INSERT INTO reference.unit_categories (
    id, name, can_be_summed, sort_order, ucum_dimension, created_at, updated_at
) VALUES
    -- Existing categories with UCUM dimensions
    ('duration', 'Duration', true, 10, 'T', '2020-08-12 02:38:02', '2020-08-12 02:38:02'),
    ('distance', 'Distance', true, 20, 'L', '2020-08-12 02:38:02', '2020-08-12 02:38:02'),
    ('weight', 'Weight', true, 30, 'M', '2020-08-12 02:38:02', '2020-08-12 02:38:02'),
    ('volume', 'Volume', true, 40, 'L3', '2020-08-12 02:38:02', '2020-08-12 02:38:02'),
    ('rating', 'Rating', false, 50, '1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('miscellany', 'Miscellany', true, 60, NULL, '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('energy', 'Energy', true, 70, 'L2MT-2', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('proportion', 'Proportion', false, 80, '1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('frequency', 'Frequency', false, 90, 'T-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('pressure', 'Pressure', false, 100, 'L-1MT-2', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('temperature', 'Temperature', false, 110, 'Θ', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('currency', 'Currency', true, 120, '[arb]', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('count', 'Count', true, 130, '1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('area', 'Area', true, 140, 'L2', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('concentration', 'Concentration', false, 150, 'L-3N', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('osmolality', 'Osmolality', false, 155, 'N.M-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),

    -- Additional UCUM categories
    ('electric_current', 'Electric Current', false, 160, 'I', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('substance', 'Amount of Substance', true, 170, 'N', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('luminous_intensity', 'Luminous Intensity', false, 180, 'J', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('velocity', 'Velocity', false, 190, 'LT-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('acceleration', 'Acceleration', false, 200, 'LT-2', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('force', 'Force', true, 210, 'LMT-2', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('power', 'Power', true, 220, 'L2MT-3', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('electric_potential', 'Electric Potential', false, 230, 'L2MT-3I-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('electric_resistance', 'Electric Resistance', false, 240, 'L2MT-3I-2', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('magnetic_flux', 'Magnetic Flux', false, 250, 'L2MT-2I-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('magnetic_flux_density', 'Magnetic Flux Density', false, 260, 'MT-2I-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('radioactivity', 'Radioactivity', false, 270, 'T-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('absorbed_dose', 'Absorbed Dose', false, 280, 'L2T-2', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('catalytic_activity', 'Catalytic Activity', false, 290, 'NT-1', '2020-08-12 02:38:03', '2020-08-12 02:38:03'),
    ('information', 'Information', true, 300, '[bit]', '2020-08-12 02:38:03', '2020-08-12 02:38:03');


-- Seed: reference.variable_categories
-- Seed data for reference.variable_categories

INSERT INTO reference.variable_categories 
(id, name, name_singular, description, synonyms, sort_order, is_public, boring, default_unit_id, minimum_allowed_value, maximum_allowed_value, 
minimum_allowed_seconds_between_measurements, filling_value, filling_type, duration_of_action, onset_delay, combination_operation, 
manual_tracking, valence, is_goal, controllable, cause_only, effect_only, predictor, outcome) VALUES
(1, 'Emotions', 'Emotion', NULL, '["Emotions","Emotion","Mood"]', 0, true, false, 10, NULL, NULL, 60, -1, 'none', 86400, 0, 'mean', true, 'neutral', 'never', 'never', false, NULL, false, true),
(2, 'Physique', '', NULL, '', 0, true, false, NULL, NULL, NULL, 86400, -1, 'none', 604800, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, true),
(3, 'Physical Activity', '', NULL, '["Physical Activity","Physical Activities"]', 0, true, false, NULL, NULL, NULL, 3600, 0, 'zero', 86400, 0, 'sum', false, 'positive', 'never', 'never', false, NULL, true, true),
(4, 'Locations', '', NULL, '["Location","Locations"]', 0, false, true, 2, NULL, NULL, 600, 0, 'zero', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, false),
(5, 'Miscellaneous', '', NULL, '["Miscellaneous","Uncategorized"]', 0, false, true, NULL, NULL, NULL, NULL, -1, NULL, 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, true),
(6, 'Sleep', '', NULL, '', 0, true, false, NULL, NULL, NULL, 86400, -1, 'none', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, true),
(7, 'Social Interactions', '', NULL, '["Social Interactions","Social Interaction"]', 0, false, false, NULL, NULL, NULL, 60, 0, 'zero', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, true),
(8, 'Vital Signs', '', NULL, '["Vital Signs","Vital Sign"]', 0, true, false, NULL, NULL, NULL, NULL, -1, 'none', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, true),
(9, 'Cognitive Performance', '', NULL, '', 0, true, false, NULL, NULL, NULL, NULL, -1, 'none', 86400, 0, 'mean', true, 'positive', 'never', 'never', false, NULL, false, true),
(10, 'Symptoms', '', NULL, '["Symptoms","Symptom"]', 0, true, false, 10, NULL, NULL, 60, -1, 'none', 86400, 0, 'mean', true, 'negative', 'never', 'never', false, NULL, true, true),
(11, 'Nutrients', '', NULL, '["Nutrients","Nutrient"]', 0, true, false, 6, NULL, NULL, NULL, -1, 'none', 86400, 0, 'mean', false, 'positive', 'never', 'never', true, NULL, true, false),
(12, 'Goals', '', NULL, '["Work","Productivity","Goals","Goal"]', 0, false, false, NULL, NULL, NULL, 60, -1, 'none', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, false, true),
(13, 'Treatments', '', NULL, '["Health and Beauty","Health & Beauty","Treatments","Treatment","HealthPersonalCare","Baby Product","Home"]', 0, true, false, 23, 0, NULL, 60, 0, 'zero', 86400, 1800, 'sum', true, 'positive', 'never', 'never', true, NULL, true, false),
(14, 'Activities', 'Activity', NULL, '["Activities","Activity"]', 0, false, false, 2, NULL, NULL, NULL, 0, 'zero', 86400, 0, 'sum', false, '', 'never', 'never', false, NULL, true, NULL),
(15, 'Foods', '', NULL, '["Grocery","Foods","Food","GourmetFood"]', 0, true, false, 44, 0, NULL, NULL, 0, 'zero', 864000, 1800, 'sum', true, 'positive', 'never', 'never', true, NULL, true, false),
(16, 'Conditions', '', NULL, '["Conditions","Condition"]', 0, true, false, NULL, NULL, NULL, NULL, -1, NULL, 86400, 0, 'mean', true, 'positive', 'never', 'never', false, NULL, false, true),
(17, 'Environment', '', NULL, '', 0, true, false, NULL, NULL, NULL, 86400, NULL, 'none', 86400, 0, 'mean', false, 'positive', 'never', 'never', true, NULL, true, false),
(18, 'Causes of Illness', '', NULL, '["Causes of Illness","Cause of Illness"]', 0, true, false, NULL, NULL, NULL, NULL, 0, 'zero', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, false),
(19, 'Books', '', NULL, '["Books","Book"]', 0, true, true, NULL, NULL, NULL, NULL, 0, 'zero', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, NULL, true, false),
(20, 'Software', '', NULL, '["Software & Mobile Apps","App","Software","Software & Mobile App","Software Usage"]', 0, false, true, 2, NULL, NULL, NULL, 0, 'zero', 86400, 0, 'sum', false, 'positive', 'never', 'never', false, NULL, true, false),
(32, 'Payments', '', NULL, '["Purchases","Payments","Payment","Purchase"]', 0, false, true, 49, NULL, NULL, NULL, 0, 'zero', 2592000, 0, 'sum', false, 'positive', 'never', 'never', false, NULL, true, false),
(42, 'Movies and TV', '', NULL, '', 0, true, true, NULL, NULL, NULL, NULL, 0, 'zero', 86400, 0, 'sum', false, 'positive', 'never', 'never', false, NULL, true, false),
(251, 'Music', '', NULL, '', 0, true, true, 23, NULL, NULL, NULL, 0, 'zero', 86400, 0, 'sum', false, 'positive', 'never', 'never', false, NULL, true, false),
(252, 'Electronics', '', NULL, '["Electronics","Electronic"]', 0, true, true, 23, 0, NULL, NULL, 0, 'zero', 604800, 1800, 'sum', false, 'positive', 'never', 'never', true, NULL, true, false),
(253, 'IT Metrics', '', NULL, '', 0, false, true, 23, NULL, NULL, NULL, -1, 'none', 86400, 0, 'sum', false, 'positive', 'never', 'never', false, false, true, false),
(254, 'Economic Indicators', '', NULL, '["Economic Data","Economic Indicators"]', 0, true, true, 15, NULL, NULL, NULL, -1, 'none', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, false, true, true),
(255, 'Investment Strategies', '', NULL, '["Investment Strategy","Investment Strategies"]', 0, true, true, 21, NULL, NULL, NULL, -1, 'none', 86400, 0, 'mean', false, 'positive', 'never', 'never', false, false, true, true);


-- Seed data for logistics
-- Seed: logistics.shipping_methods
-- Seed data for logistics.shipping_methods

INSERT INTO logistics.shipping_methods (name, description, estimated_days_min, estimated_days_max, is_active) VALUES
('standard', 'Standard shipping (5-7 business days)', 5, 7, true),
('express', 'Express shipping (2-3 business days)', 2, 3, true),
('overnight', 'Overnight shipping (next business day)', 1, 1, true),
('international', 'International shipping (7-14 business days)', 7, 14, true);


-- Seed: logistics.shipping_rates
-- Seed data for logistics.shipping_rates

INSERT INTO logistics.shipping_rates (shipping_method_id, zone, base_rate, rate_per_kg) VALUES
((SELECT id FROM logistics.shipping_methods WHERE name = 'standard'), 'domestic', 5.99, 0.50),
((SELECT id FROM logistics.shipping_methods WHERE name = 'express'), 'domestic', 12.99, 1.00),
((SELECT id FROM logistics.shipping_methods WHERE name = 'overnight'), 'domestic', 24.99, 2.00),
((SELECT id FROM logistics.shipping_methods WHERE name = 'international'), 'international', 19.99, 3.00);


-- Seed data for scheduling
-- Seed: scheduling.service_types
-- Seed data for scheduling.service_types

INSERT INTO scheduling.service_types (name, description, duration_minutes, is_active) VALUES
('initial_consultation', 'Initial medical consultation', 60, true),
('follow_up', 'Follow-up appointment', 30, true),
('lab_review', 'Laboratory results review', 30, true),
('treatment_session', 'Treatment session', 45, true),
('emergency_consultation', 'Emergency consultation', 60, true);

