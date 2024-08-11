CREATE OR REPLACE FUNCTION public.notify_data_change()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    primary_key_columns TEXT[];    -- Array to hold primary key column names
    primary_key_json JSONB := '{}'::jsonb; -- Initialize an empty JSONB object for primary key data
    col TEXT;                      -- Declare the loop variable
    row_data JSONB;                -- JSONB representation of the new row data
BEGIN
    -- Convert the new row to a JSONB object
    --row_data := to_jsonb(NEW);
	    -- Determine whether to use OLD or NEW row data based on the operation
    IF (TG_OP = 'DELETE') THEN
        row_data := to_jsonb(OLD); -- Use OLD row data for DELETE
    ELSE
        row_data := to_jsonb(NEW); -- Use NEW row data for INSERT and UPDATE
    END IF;

	
    -- Retrieve the primary key column names for the current table
    SELECT array_agg(att.attname::text)
    INTO primary_key_columns
    FROM pg_index idx
    JOIN pg_attribute att ON att.attnum = ANY(idx.indkey)
    WHERE idx.indrelid = TG_RELID
      AND idx.indisprimary;

    -- Debug: Output primary key columns
    RAISE NOTICE 'Primary Key Columns: %', primary_key_columns;

    -- Loop through each primary key column and build a JSON object
    FOREACH col IN ARRAY primary_key_columns
    LOOP
        -- Ensure the column exists in the row_data before adding to primary_key_json
        IF row_data ? col THEN
            -- Add each primary key column and its value to the JSON object
            primary_key_json := primary_key_json || jsonb_build_object(col, row_data->col);
        END IF;
    END LOOP;

    -- Debug: Output primary key JSON
    RAISE NOTICE 'Primary Key JSON: %', primary_key_json;

    -- Send a notification with the operation, table, primary key, and row data
    PERFORM pg_notify(
        'data_change',
        jsonb_build_object(
            'operation', TG_OP,
            'table', TG_TABLE_NAME,
            'primaryKeycol', primary_key_json,
            'data', row_data
        )::text
    );

    --RETURN NEW;
    -- Return the appropriate row based on the operation
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.notify_data_change()
    OWNER TO postgres;
