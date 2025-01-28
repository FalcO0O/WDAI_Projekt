import { useState, useEffect } from 'react';
import { Container, Typography, TextField, MenuItem, Paper, Box } from '@mui/material';

const CalorieCalculatorContent = () => {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [activity, setActivity] = useState('1.2');
    const [goal, setGoal] = useState('maintain');
    const [calories, setCalories] = useState(0);

    const calculateCalories = () => {
        const weightNum = parseFloat(weight);
        const heightNum = parseFloat(height);
        const ageNum = parseFloat(age);
        const activityNum = parseFloat(activity);

        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
        } else {
            bmr = 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
        }

        let result = bmr * activityNum;

        if (goal === 'lose') result -= 500;
        if (goal === 'gain') result += 500;

        return Math.round(result);
    };

    useEffect(() => {
        if (age && weight && height) {
            setCalories(calculateCalories());
        }
    }, [age, gender, weight, height, activity, goal]);

    return (
        <Container maxWidth="sm" sx={{
            mt: 4,
        }}>
            <Typography variant="h4" align="center" gutterBottom>
                Kalkulator Bilansu Kalorycznego
            </Typography>

            <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                <TextField
                    fullWidth
                    label="Wiek"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    inputProps={{ min: 10, max: 100 }}
                />

                <TextField
                    fullWidth
                    select
                    label="Płeć"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <MenuItem value="male">Mężczyzna</MenuItem>
                    <MenuItem value="female">Kobieta</MenuItem>
                </TextField>

                <TextField
                    fullWidth
                    label="Waga (kg)"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    inputProps={{ min: 30, max: 200 }}
                />

                <TextField
                    fullWidth
                    label="Wzrost (cm)"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    inputProps={{ min: 100, max: 250 }}
                />

                <TextField
                    fullWidth
                    select
                    label="Poziom aktywności"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                >
                    <MenuItem value="1.2">Siedzący tryb życia</MenuItem>
                    <MenuItem value="1.55">Umiarkowana aktywność</MenuItem>
                    <MenuItem value="1.725">Aktywny tryb życia</MenuItem>
                </TextField>

                <TextField
                    fullWidth
                    select
                    label="Cel"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                >
                    <MenuItem value="lose">Utarta wagi</MenuItem>
                    <MenuItem value="maintain">Utrzymanie wagi</MenuItem>
                    <MenuItem value="gain">Przytycie</MenuItem>
                </TextField>
            </Box>

            {calories !== 0 && (
                <Paper elevation={3} sx={{ mt: 4, p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">
                        Dzienne zapotrzebowanie kaloryczne: <strong>{calories} kcal</strong>
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default CalorieCalculatorContent;