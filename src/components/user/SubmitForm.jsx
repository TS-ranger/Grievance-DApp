import { useState } from "react";
import { useContract } from "../../hooks/useContract";
import { CATEGORIES } from "../../utils/constants";
import Button from "../common/Button";

export default function SubmitForm({ onSuccess }) {
  const { submitGrievance } = useContract();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Please describe your grievance");
      return;
    }

    setSubmitting(true);
    try {
      await submitGrievance(description.trim(), category);
      setDescription("");
      setCategory(CATEGORIES[0].value);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-form">
      <div className="submit-form__card">
        <div className="submit-form__header">
          <h2 className="submit-form__title">Submit Grievance</h2>
          <p className="submit-form__subtitle">
            Describe your issue below. It will be recorded on the blockchain.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Describe your issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={submitting}
          >
            {submitting ? "Submitting to Blockchain..." : "Submit Grievance"}
          </Button>
        </form>
      </div>
    </div>
  );
}
