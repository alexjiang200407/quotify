<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up()
    {
        $procedure = "
            DROP PROCEDURE IF EXISTS update_daily_quote;
            CREATE PROCEDURE update_daily_quote()
            BEGIN
                SET @random_quote_id = (
                    SELECT id
                    FROM quotes
                    ORDER BY RAND()
                    LIMIT 1
                );

                IF @random_quote_id IS NOT NULL THEN
                    IF (SELECT count(*) from daily_quote) = 0 THEN
                        INSERT INTO daily_quote VALUES (CURDATE(), CURDATE(), CURDATE(), @random_quote_id);
                    ELSE
                        UPDATE daily_quote
                        SET quote_id = @random_quote_id,
                            updated_at = CURDATE();
                    END IF;
                END IF;
            END;
        ";

        DB::unprepared($procedure);
    }

    public function down()
    {
        DB::statement('DROP PROCEDURE IF EXISTS update_daily_quote');
    }
};
