#A quantidade de horas que cada professor tem comprometido em aulas

SELECT PROFESSOR.name AS Nome, SUM(TIMESTAMPDIFF(MINUTE, CS.start_time, CS.end_time)) / 60.0 AS horas
FROM PROFESSOR
JOIN SUBJECT ON PROFESSOR.id = S.taught_by
JOIN CLASS AS C ON S.id = C.subject_id
JOIN CLASS_SCHEDULE AS CS ON C.id = CS.class_id
GROUP BY PROFESSOR.name
ORDER BY horas DESC;