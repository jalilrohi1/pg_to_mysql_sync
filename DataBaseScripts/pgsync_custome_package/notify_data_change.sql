-- FUNCTION: public.notify_data_change()

-- DROP FUNCTION IF EXISTS public.notify_data_change();

CREATE OR REPLACE FUNCTION public.notify_data_change()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
    primary_key_columns TEXT[];            -- Array to hold primary key column names
    primary_key_json JSONB := '{}'::jsonb; -- Initialize an empty JSONB object for primary key data
    col TEXT;                              -- Declare the loop variable
    row_data JSONB;                        -- JSONB representation of the new row data
    geom_col TEXT;                         -- Variable to hold geometry column names
    geom_columns TEXT[];                   -- Array to hold geometry column names
    geom_wkt TEXT;                         -- Variable to hold the WKT format of the geometry data
BEGIN

    -- Determine whether to use OLD or NEW row data based on the operation
    IF (TG_OP = 'DELETE') THEN
       -- RAISE NOTICE 'Operation: DELETE';
        row_data := to_jsonb(OLD); -- Use OLD row data for DELETE
    ELSE

    -- Convert the row to JSONB
    row_data := TO_JSONB(NEW);

    -- Gather all geometry column names into an array
    SELECT array_agg(column_name)
    INTO geom_columns
    FROM information_schema.columns
    WHERE table_name = TG_TABLE_NAME
    AND udt_name = 'geometry';            -- Only fetch columns of type geometry

	RAISE NOTICE 'GEMETRY COLUMNS ARE : %', geom_columns;
    -- Iterate over each geometry column name in the array
    FOREACH geom_col IN ARRAY geom_columns
    LOOP
        -- Dynamically get the geometry column value from NEW using EXECUTE
        EXECUTE format('SELECT ($1).%I', geom_col)
        INTO geom_wkt
        USING NEW;

        IF geom_wkt IS NOT NULL THEN
            RAISE NOTICE 'CHECKING THE EXECUTION OF IF for column %', geom_col;
            -- Convert geometry to WKT format
            geom_wkt := ST_AsText(geom_wkt);
            -- Update the row_data JSONB with WKT geometry
            row_data := jsonb_set(row_data, ARRAY[geom_col], to_jsonb(geom_wkt));
        END IF;
    END LOOP;

-- Debug: Output row_data after conversion to WKT
         RAISE NOTICE 'row_data after conversion to WKT: %', row_data;
    END IF;


-------------------------------------==================
    -- Retrieve the primary key column names for the current table
    SELECT array_agg(column_name::text)
    INTO primary_key_columns
    FROM information_schema.key_column_usage
    WHERE table_name = TG_TABLE_NAME
    AND table_schema = TG_TABLE_SCHEMA
    AND constraint_name IN (
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = TG_TABLE_NAME
        AND table_schema = TG_TABLE_SCHEMA
        AND constraint_type = 'PRIMARY KEY'
    );
    -- Debug: Output primary key columns
    -- RAISE NOTICE 'Primary key columns: %', primary_key_columns;

    -- Loop through each primary key column and build a JSON object, including geometry columns
    FOREACH col IN ARRAY primary_key_columns
    LOOP
        --RAISE NOTICE 'Processing primary key column: %', col;

        -- Ensure the column exists in the row_data before adding to primary_key_json
        IF row_data ? col THEN
          --  RAISE NOTICE 'Adding primary key column to JSON: %', col;
            -- Add each primary key column and its value to the JSON object
            primary_key_json := primary_key_json || jsonb_build_object(col, row_data->col);
        ELSE
            RAISE NOTICE 'Column % not found in row_data.', col;
        END IF;
    END LOOP;

    -- Debug: Output row_data after adding primary key columns
    --RAISE NOTICE 'row_data after adding primary key columns: %', row_data;

    -- Send a notification with the operation, table, primary key, and row data
   -- RAISE NOTICE 'Sending notification...';
    PERFORM pg_notify(
        'data_change',
        jsonb_build_object(
            'operation', TG_OP,
            'table', TG_TABLE_NAME,
            'primaryKeycol', primary_key_json,
            'data', row_data
        )::text
    );
    -- Return the appropriate row based on the operation
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$BODY$;

ALTER FUNCTION public.notify_data_change () OWNER TO postgres;