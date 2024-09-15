CREATE OR REPLACE FUNCTION pgsync_custome_package.create_notify_triggers_for_tables(table_names TEXT[])
RETURNS VOID AS $$
DECLARE
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        EXECUTE format('
            CREATE TRIGGER %I_notify_data_change
            AFTER INSERT OR UPDATE OR DELETE 
            ON %I
            FOR EACH ROW EXECUTE FUNCTION pgsync_custome_package.notify_data_change();', 
            table_name, table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;