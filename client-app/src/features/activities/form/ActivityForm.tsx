import React, { useState, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { category } from "../../../app/common/options/categoryOptions";
import DateInput from "../../../app/common/form/DateInput";
import { combinedDatesandTime } from "../../../app/common/util/util";
import { combineValidators, isRequired, hasLengthGreaterThan, composeValidators } from 'revalidate';
import { RootStoreContext } from "../../../app/stores/rootStore";

const validate = combineValidators({
    title: isRequired({message:  "The event title is required"}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired("Description"),
        hasLengthGreaterThan(4)({message: "Description needs to be at least 5 characters"})
    )(),
    city: isRequired('City'),
    venue: isRequired("Venue"),
    date: isRequired("Date"),
    time: isRequired("Time")
})

interface FormParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<FormParams>> = ({
    match,
    history
}) => {
    const rootStore = useContext(RootStoreContext);
    const {
        createActivity,
        updateActivity,
        submitting,
        loadActivity,
    } = rootStore.activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id).then(
                (activity) => {
                    setActivity(new ActivityFormValues(activity));
                }).finally(() => setLoading(false));
        }
    }, [
        loadActivity,
        match.params.id,
    ]);


    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combinedDatesandTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            updateActivity(activity);
        }
    };

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing >
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form loading={loading}>
                                <Field
                                    name="title"
                                    placeholder="Title"
                                    value={activity.title}
                                    component={TextInput}
                                />
                                <Field
                                    name="description"
                                    placeholder="Description"
                                    rows='3'
                                    value={activity.description}
                                    component={TextAreaInput}
                                />
                                <Field
                                    placeholder="Category"
                                    name="category"
                                    value={activity.category}
                                    component={SelectInput}
                                    options={category}
                                />
                                <Form.Group widths='equal'>
                                    <Field
                                        component={DateInput}
                                        placeholder="Date"
                                        date={true}
                                        name="date"
                                        value={activity.date}
                                    />
                                    <Field
                                        component={DateInput}
                                        placeholder="Time"
                                        time={true}
                                        name="time"
                                        value={activity.time}
                                    />
                                </Form.Group>

                                <Field
                                    component={TextInput}
                                    placeholder="City"
                                    name="city"
                                    value={activity.city}
                                />
                                <Field
                                    component={TextInput}
                                    placeholder="Venue"
                                    name="venue"
                                    value={activity.venue}
                                />
                                <Button
                                    loading={submitting}
                                    floated="right"
                                    disabled={loading || invalid || pristine}
                                    onClick={handleSubmit}
                                    positive
                                    type="submit"
                                    content="Submit"
                                ></Button>
                                <Button
                                    floated="right"
                                    onClick={ activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push("/activities")}
                                    disabled={loading}
                                    type="button"
                                    content="Cancel"
                                ></Button>
                            </Form>
                        )}
                    />

                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);