CREATE OR REPLACE FUNCTION my_custom_package.drop_notify_triggers_for_tables(table_names TEXT[])
RETURNS VOID AS $$
DECLARE
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS %I_notify_data_change ON %I;', 
            table_name, table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;